# Motocorp DMS - Solo-Dev Backend Architecture

## Executive Summary

This document outlines a **solo-developer-friendly** backend architecture for Motocorp Dealership Management System, designed to efficiently scale to **10,000 organizations** with minimal operational overhead while maintaining clean code and sustainable growth.

## Architecture Philosophy: "Simple First, Scale Smart"

### Core Principles
- **Monolith First**: Single codebase until proven scale bottlenecks
- **One Database Per Tenant**: Simple isolation, easy backups, straightforward scaling
- **Modern Stack**: NestJS + Fastify + PostgreSQL 15 + Redis 7
- **Deploy Simple**: Docker Compose → Cloud containers (Railway/Fly.io) → AWS if needed

### Why This Approach for 10K Organizations
- PostgreSQL handles 10K databases on single instance efficiently
- Simpler debugging and maintenance for solo developer
- Linear cost scaling without Kubernetes complexity
- Easy tenant-specific backups and data isolation

## 1. Multi-Tenant Organization Hierarchy

### Organization Structure
```
Enterprise Organization (e.g., "ABC Motorcycle Group")
├── Dealership 1 (Location: New York)
│   ├── Sales Department
│   ├── Service Department
│   └── Parts & Accessories
├── Dealership 2 (Location: California)
│   ├── Sales Department
│   ├── Service Department
│   └── Parts & Accessories
└── Corporate Office
    ├── Regional Managers
    ├── Finance Team
    └── Inventory Coordinators
```

### Multi-Tenancy Implementation: One Database Per Tenant
```typescript
// Tenant Context with Database-Per-Tenant
interface TenantContext {
  organizationId: string;
  dealershipId?: string;
  userId: string;
  permissions: Permission[];
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  databaseName: string; // tenant_org_abc123
}

// Simple Database-Per-Tenant Strategy
class TenantService {
  async getConnection(organizationId: string): Promise<Database> {
    const dbName = `tenant_org_${organizationId}`;
    return await this.connectionPool.getConnection(dbName);
  }

  async createTenantDatabase(organizationId: string): Promise<void> {
    const dbName = `tenant_org_${organizationId}`;
    await this.masterDb.query(`CREATE DATABASE "${dbName}"`);
    await this.runMigrations(dbName);
  }
}
```

## 2. Database-Per-Tenant Schema Design

### Master Database (Shared)
```sql
-- Master database: shared_data
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    database_name VARCHAR(100) NOT NULL UNIQUE, -- tenant_org_abc123
    subscription_tier VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    settings JSONB
);

CREATE TABLE billing_accounts (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    stripe_customer_id VARCHAR(100),
    subscription_status VARCHAR(50),
    billing_email VARCHAR(255)
);
```

### Per-Tenant Database Schema
```sql
-- Each organization gets its own database: tenant_org_abc123
CREATE TABLE dealerships (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL, -- reference to master db
    name VARCHAR(255) NOT NULL,
    location JSONB,
    timezone VARCHAR(50),
    business_hours JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    dealership_id UUID,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50), -- admin, manager, sales, service, finance
    permissions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory (
    id UUID PRIMARY KEY,
    dealership_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- motorcycle, part, accessory
    category VARCHAR(100),
    name VARCHAR(255),
    description TEXT,
    cost_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    quantity_on_hand INTEGER,
    reorder_point INTEGER,
    supplier_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    primary_dealership_id UUID,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    preferences JSONB,
    lifetime_value DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    dealership_id UUID NOT NULL,
    sales_person_id UUID REFERENCES users(id),
    stage VARCHAR(50), -- lead, qualified, proposal, negotiation, closed_won, closed_lost
    total_amount DECIMAL(12,2),
    items JSONB, -- Array of inventory items
    notes TEXT,
    estimated_close_date DATE,
    actual_close_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE service_appointments (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    dealership_id UUID NOT NULL,
    technician_id UUID REFERENCES users(id),
    vehicle_info JSONB,
    service_type VARCHAR(100),
    status VARCHAR(50), -- scheduled, in_progress, completed, cancelled
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    labor_hours DECIMAL(4,2),
    parts_used JSONB,
    total_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Collaboration & Communication Tables
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50), -- inventory_alert, sales_update, service_reminder
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_feed (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    dealership_id UUID,
    entity_type VARCHAR(50), -- customer, sale, service, inventory
    entity_id UUID,
    action VARCHAR(100), -- created, updated, deleted, transferred
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Scaling: 10K Organizations Strategy
```typescript
// No Sharding Needed - Single PostgreSQL Instance
class DatabaseManager {
  // One connection pool, dynamic database switching
  async getConnection(organizationId: string): Promise<Connection> {
    const dbName = `tenant_org_${organizationId}`;
    const connection = await this.pool.connect();
    await connection.query(`SET search_path TO "${dbName}"`);
    return connection;
  }

  // Backup individual tenant
  async backupTenant(organizationId: string): Promise<string> {
    const dbName = `tenant_org_${organizationId}`;
    return await exec(`pg_dump ${dbName} > backup_${dbName}_${Date.now()}.sql`);
  }
}
```

## 3. Monolith Architecture: NestJS + Fastify

### Single Application, Modular Design

```typescript
// app.module.ts - Main Application Module
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(), // Master database connection
    TenantModule,           // Dynamic database connections per tenant
    AuthModule,
    OrganizationModule,
    InventoryModule,
    CustomerModule,
    SalesModule,
    ServiceModule,
    FinancialModule,
    NotificationModule,
    AnalyticsModule,
  ],
})
export class AppModule {}

// Core Domain Services (Internal APIs)
@Injectable()
export class AuthService {
  async login(email: string, password: string): Promise<AuthToken>;
  async validateToken(token: string): Promise<TenantContext>;
  async refreshToken(refreshToken: string): Promise<AuthToken>;
  async checkPermissions(userId: string, resource: string, action: string): Promise<boolean>;
}

@Injectable()
export class OrganizationService {
  async createOrganization(data: CreateOrgRequest): Promise<Organization>;
  async addDealership(orgId: string, dealership: DealershipData): Promise<Dealership>;
  async transferCustomer(customerId: string, fromDealership: string, toDealership: string): Promise<void>;
  async getOrganizationMetrics(orgId: string): Promise<OrgMetrics>;
}

@Injectable()
export class InventoryService {
  async addItem(dealershipId: string, item: InventoryItem): Promise<InventoryItem>;
  async updateStock(itemId: string, quantity: number): Promise<void>;
  async transferStock(itemId: string, fromDealership: string, toDealership: string, quantity: number): Promise<void>;
  async getStockAlerts(dealershipId: string): Promise<StockAlert[]>;
  async searchInventory(orgId: string, filters: InventoryFilters): Promise<InventoryItem[]>;
}

@Injectable()
export class CustomerService {
  async createCustomer(customer: CustomerData): Promise<Customer>;
  async getCustomerHistory(customerId: string): Promise<CustomerHistory>;
  async assignToDealer(customerId: string, dealershipId: string): Promise<void>;
  async getCustomerInsights(customerId: string): Promise<CustomerInsights>;
}

@Injectable()
export class SalesService {
  async createLead(lead: LeadData): Promise<Sale>;
  async updateSaleStage(saleId: string, stage: SaleStage): Promise<Sale>;
  async assignSalesperson(saleId: string, salespersonId: string): Promise<void>;
  async getSalesPipeline(dealershipId: string): Promise<SalesPipeline>;
  async getSalesMetrics(dealershipId: string, period: DateRange): Promise<SalesMetrics>;
}

@Injectable()
export class ServiceService {
  async scheduleAppointment(appointment: AppointmentData): Promise<ServiceAppointment>;
  async assignTechnician(appointmentId: string, technicianId: string): Promise<void>;
  async updateServiceStatus(appointmentId: string, status: ServiceStatus): Promise<void>;
  async getServiceQueue(dealershipId: string): Promise<ServiceAppointment[]>;
  async getTechnicianWorkload(technicianId: string): Promise<TechnicianWorkload>;
}

@Injectable()
export class FinancialService {
  async createInvoice(saleId: string): Promise<Invoice>;
  async processPayment(invoiceId: string, paymentData: PaymentData): Promise<Payment>;
  async generateFinancialReport(dealershipId: string, period: DateRange): Promise<FinancialReport>;
  async syncWithAccounting(dealershipId: string, provider: 'xero' | 'quickbooks'): Promise<void>;
}

@Injectable()
export class NotificationService {
  async sendNotification(userId: string, notification: NotificationData): Promise<void>;
  async broadcastToOrganization(orgId: string, message: BroadcastMessage): Promise<void>;
  async scheduleReminder(appointmentId: string, reminderTime: Date): Promise<void>;
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences>;
}

@Injectable()
export class AnalyticsService {
  async trackEvent(event: AnalyticsEvent): Promise<void>;
  async generateDashboard(dealershipId: string, widgets: string[]): Promise<Dashboard>;
  async createCustomReport(reportConfig: ReportConfig): Promise<Report>;
  async getBusinessIntelligence(orgId: string): Promise<BIInsights>;
}
```

## 4. Collaboration Features Architecture

### Real-time Communication: Socket.IO with Redis
```typescript
// Simple WebSocket with Socket.IO + Redis Adapter
@WebSocketGateway({
  cors: { origin: '*' },
  adapter: createRedisAdapter(redisClient)
})
export class CollaborationGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_organization')
  async handleJoinOrganization(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { organizationId: string }
  ) {
    await client.join(`org_${data.organizationId}`);
  }

  async broadcastToOrganization(orgId: string, message: CollaborationMessage) {
    this.server.to(`org_${orgId}`).emit('collaboration_update', message);
  }

  async notifyInventoryAlert(organizationId: string, alert: StockAlert) {
    this.server.to(`org_${organizationId}`).emit('inventory_alert', alert);
  }
}

// Collaboration Message Types
interface CollaborationMessage {
  type: 'customer_update' | 'inventory_alert' | 'sale_assigned' | 'service_completed';
  organizationId: string;
  dealershipId?: string;
  data: any;
  timestamp: Date;
  userId: string;
}
```

### Cross-Dealership Data Sharing
```typescript
// Customer Transfer Workflow
class CustomerTransferService {
  async transferCustomer(
    customerId: string,
    fromDealership: string,
    toDealership: string,
    transferData: TransferRequest
  ): Promise<CustomerTransfer> {

    // 1. Validate permissions
    await this.validateTransferPermissions(transferData.requestedBy, fromDealership, toDealership);

    // 2. Create transfer record
    const transfer = await this.createTransferRecord({
      customerId,
      fromDealership,
      toDealership,
      reason: transferData.reason,
      requestedBy: transferData.requestedBy,
      status: 'pending'
    });

    // 3. Notify stakeholders
    await this.notificationService.notifyTransferRequest(transfer);

    // 4. Update customer assignment
    await this.customerService.updatePrimaryDealership(customerId, toDealership);

    // 5. Transfer sales history and preferences
    await this.transferCustomerData(customerId, fromDealership, toDealership);

    return transfer;
  }
}
```

## 5. Simple Performance Strategy

### Basic Caching with Redis
```typescript
// Single Redis Instance with Key Prefixes
@Injectable()
export class CacheService {
  private readonly redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    maxRetriesPerRequest: 3
  });

  async cacheUserSession(orgId: string, userId: string, sessionData: UserSession) {
    const key = `${orgId}:session:${userId}`;
    await this.redis.setex(key, 3600, JSON.stringify(sessionData));
  }

  async cacheInventoryData(orgId: string, dealershipId: string, inventory: InventoryItem[]) {
    const key = `${orgId}:inventory:${dealershipId}`;
    await this.redis.setex(key, 300, JSON.stringify(inventory)); // 5 min cache
  }

  async cacheDashboardData(orgId: string, userId: string, dashboard: Dashboard) {
    const key = `${orgId}:dashboard:${userId}`;
    await this.redis.setex(key, 600, JSON.stringify(dashboard)); // 10 min cache
  }

  async invalidateOrgCache(orgId: string) {
    const keys = await this.redis.keys(`${orgId}:*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

### Simple Database Connection
```typescript
// Single Connection Pool, Database-per-Tenant
@Injectable()
export class TenantDatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: 5432,
      max: 100, // Total connections across all tenants
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async getConnection(organizationId: string): Promise<PoolClient> {
    const client = await this.pool.connect();
    const dbName = `tenant_org_${organizationId}`;
    await client.query(`SELECT set_config('search_path', '${dbName}', true)`);
    return client;
  }

  // No read replicas needed for 10K orgs
  async executeQuery(orgId: string, query: string, params: any[] = []) {
    const client = await this.getConnection(orgId);
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
```

## 6. Solo-Dev 90-Day Build Plan

### Phase 1: MVP (0-100 Organizations) - Days 1-30
```typescript
// Week 1-2: Core Setup
interface MVPStack {
  framework: 'NestJS + Fastify';
  database: 'PostgreSQL 17 (single instance) - Neon.com';
  auth: 'JWT + Passport => @stackframe/react for frontend Vite app';
  deployment: 'Docker Compose on single VPS';
  storage: 'Local file system';
  monitoring: 'Built-in health checks + simple logs';
}

// Week 3-4: Core Features
const mvpFeatures = [
  'User authentication & organization setup',
  'Basic inventory CRUD',
  'Simple customer management',
  'Basic sales pipeline',
  'Service appointment scheduling'
];
```

### Phase 2: Growth (100-1000 Organizations) - Days 31-60
```typescript
interface GrowthStack {
  framework: 'Same NestJS monolith';
  database: 'Managed PostgreSQL (Railway/Fly.io/AWS RDS)';
  cache: 'Managed Redis';
  storage: 'AWS S3 or equivalent';
  deployment: 'Railway/Fly.io containers (auto-scaling)';
  monitoring: 'Simple APM (Railway insights or similar)';
  cdn: 'Cloudflare (free tier)';
}

// Week 5-6: Enhanced Features
const growthFeatures = [
  'Real-time notifications (Socket.IO)',
  'File uploads & management',
  'Basic reporting & analytics',
  'Email notifications',
  'API rate limiting'
];

// Week 7-8: Polish & Performance
const optimizations = [
  'Database query optimization',
  'Caching implementation',
  'UI/UX improvements',
  'Mobile responsiveness',
  'Basic error tracking'
];
```

### Phase 3: Scale (1000-10000 Organizations) - Days 61-90
```typescript
interface ScaleStack {
  framework: 'Same NestJS monolith (proven stable)';
  database: 'PostgreSQL with connection pooling optimization';
  cache: 'Redis with better key strategies';
  storage: 'CDN-backed file storage';
  deployment: 'Multi-region if needed, otherwise same';
  monitoring: 'Better logging + basic metrics';
  backup: 'Automated database backups';
}

// Week 9-10: Advanced Features
const scaleFeatures = [
  'Advanced analytics & reporting',
  'Integrations (accounting, payment)',
  'Bulk operations',
  'Advanced permissions',
  'Data export/import'
];

// Week 11-12: Production Hardening
const productionReady = [
  'Comprehensive error handling',
  'Data backup & recovery procedures',
  'Performance monitoring',
  'Security audit',
  'Documentation'
];
```

## 7. Security & Compliance

### Multi-Tenant Security
```typescript
// Row Level Security (RLS)
CREATE POLICY tenant_isolation ON tenant_org123.customers
  USING (organization_id = current_setting('app.current_organization_id')::UUID);

// Data Encryption
class EncryptionService {
  async encryptSensitiveData(data: string, tenantId: string): Promise<string> {
    const key = await this.getTenantEncryptionKey(tenantId);
    return await this.aesEncrypt(data, key);
  }

  async decryptSensitiveData(encryptedData: string, tenantId: string): Promise<string> {
    const key = await this.getTenantEncryptionKey(tenantId);
    return await this.aesDecrypt(encryptedData, key);
  }
}
```

### API Security
```typescript
// Rate Limiting by Tenant
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const tenant = req.tenant;
    return tenant.subscriptionTier === 'enterprise' ? 1000 :
           tenant.subscriptionTier === 'professional' ? 500 : 100;
  },
  keyGenerator: (req) => `${req.tenant.organizationId}:${req.ip}`,
}));

// API Key Management
class APIKeyService {
  async generateAPIKey(organizationId: string, permissions: string[]): Promise<APIKey> {
    const key = this.generateSecureKey();
    await this.storeAPIKey({
      key,
      organizationId,
      permissions,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });
    return { key, permissions };
  }
}
```

## 8. Simple Monitoring & Health Checks

### Basic Performance Tracking
```typescript
// Simple Metrics without Heavy Instrumentation
@Injectable()
export class HealthService {
  async getDealershipHealth(dealershipId: string) {
    const metrics = {
      activeSales: await this.salesService.getActiveSalesCount(dealershipId),
      inventoryCount: await this.inventoryService.getTotalItems(dealershipId),
      pendingServices: await this.serviceService.getPendingCount(dealershipId),
      lastActivity: await this.getLastActivityTime(dealershipId)
    };
    return metrics;
  }

  async checkSystemHealth() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: await this.checkDatabaseHealth(),
        redis: await this.checkRedisHealth()
      }
    };
    return health;
  }
}

// Health Check Endpoint
@Controller('health')
export class HealthController {
  @Get()
  async healthCheck() {
    const health = await this.healthService.checkSystemHealth();
    const status = health.services.database && health.services.redis ? 200 : 503;
    return health;
  }
}
```

## 9. Simple Deployment Strategy

### Docker Compose for Local Development
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/motocorp_master
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=motocorp_master
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Simple CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      # Option 1: Deploy to Railway
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}

      # Option 2: Deploy to Fly.io
      # - uses: superfly/flyctl-actions/setup-flyctl@master
      # - run: flyctl deploy --remote-only
      #   env:
      #     FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

      # Option 3: Simple VPS deployment
      # - name: Deploy to VPS
      #   run: |
      #     docker build -t motocorp-api .
      #     docker save motocorp-api | ssh user@server 'docker load && docker-compose up -d'
```

## Conclusion: Solo-Dev Architecture Benefits

This **simplified** backend architecture provides:

### ✅ **What You Keep (80% of value)**
1. **Multi-tenancy**: Clean isolation with database-per-tenant strategy
2. **Scalability**: Linear scaling to 10,000 organizations on single PostgreSQL instance
3. **Performance**: Simple Redis caching with key prefixes
4. **Maintainability**: Single codebase, consistent patterns, easier debugging
5. **Security**: Database isolation, JWT auth, input validation
6. **Deploy Simplicity**: Docker Compose → Railway/Fly.io → AWS as needed

### ❌ **What You Cut (70% of complexity)**
- ~~Kubernetes orchestration~~ → Docker Compose
- ~~Microservices architecture~~ → NestJS monolith
- ~~Multi-shard databases~~ → Single PostgreSQL with per-tenant DBs
- ~~Elasticsearch clusters~~ → PostgreSQL full-text search
- ~~Prometheus + Grafana~~ → Simple health checks + logs
- ~~Service mesh complexity~~ → Direct function calls

### 🎯 **Perfect For Solo Developer**
- **90-day build timeline** instead of 6+ months
- **$50-200/month** hosting costs instead of $500-2000/month
- **1 person can maintain** instead of requiring DevOps team
- **Simple debugging** with single application and database
- **Easy backups** with `pg_dump tenant_org_123`

### 📈 **Growth Path**
Start simple, prove product-market fit, hire team **then** add complexity if needed. Most SaaS companies with 10K organizations run on simpler architectures than the original microservices plan.
