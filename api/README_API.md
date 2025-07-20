# Motocorp DMS API

A comprehensive dealership management system API built with NestJS, Fastify, Prisma, and PostgreSQL.

## 🚀 Features

- **Multi-tenant Architecture**: Database-per-tenant isolation
- **JWT Authentication**: Secure user authentication with Passport.js
- **Modern Stack**: NestJS + Fastify + Prisma + PostgreSQL
- **Type Safety**: Full TypeScript support
- **Health Monitoring**: Built-in health checks
- **Docker Support**: Containerized deployment

## 📋 Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (Neon database configured)
- Redis (optional, for caching)

## 🛠️ Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm exec prisma generate

# Push database schema
pnpm exec prisma db push
```

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_aUcIE5JHTSY4@ep-falling-glitter-aeq33hgp-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3000

# Rate Limiting
RATE_LIMIT_TTL=900
RATE_LIMIT_MAX=100

# Redis Configuration (optional)
REDIS_URL="redis://localhost:6379"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"
```

## 🚦 Running the Application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# With Docker Compose
docker-compose up -d
```

## 📚 API Endpoints

### Health Check
- `GET /health` - System health status
- `GET /health/database` - Database health status

### Authentication
- `POST /auth/register` - Register new organization and admin user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Organizations
- `GET /organizations` - List all organizations
- `GET /organizations/:id` - Get organization details
- `GET /organizations/:id/stats` - Get organization statistics

## 🔐 Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 API Usage Examples

### Register New Organization

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Example Dealership"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get User Profile (Protected)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🏗️ Architecture

### Multi-Tenant Design

The application uses a **database-per-tenant** architecture:

- **Master Database**: Stores organization metadata and billing information
- **Tenant Databases**: Each organization gets its own isolated database
- **Tenant Service**: Manages database connections and tenant operations

### Database Schema

#### Master Database Tables:
- `organizations` - Organization metadata
- `billing_accounts` - Billing and subscription information

#### Tenant Database Tables:
- `dealerships` - Dealership locations
- `users` - Organization users
- `customers` - Customer information
- `inventory` - Product inventory
- `sales` - Sales pipeline
- `service_appointments` - Service scheduling
- `notifications` - User notifications
- `activity_feed` - Activity tracking

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Class-validator for request validation
- **CORS**: Cross-origin resource sharing enabled
- **Rate Limiting**: Built-in rate limiting support

## 📦 Deployment

### Docker Deployment

```bash
# Build image
docker build -t motocorp-api .

# Run container
docker run -p 3000:3000 --env-file .env motocorp-api
```

### Cloud Deployment

The application is designed for easy deployment on:
- Railway.app
- Fly.io
- AWS ECS/Fargate
- Google Cloud Run

## 🛠️ Development

### Database Operations

```bash
# Reset database
pnpm exec prisma migrate reset

# Deploy migrations
pnpm exec prisma migrate deploy

# View database
pnpm exec prisma studio
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Type check
pnpm run build
```

## 📈 Monitoring

The application includes built-in monitoring:

- Health check endpoints
- Request/response logging
- Error tracking
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.