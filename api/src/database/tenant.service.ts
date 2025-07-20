import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma';
import { DatabaseService } from './database.service';

export interface TenantContext {
  organizationId: string;
  dealershipId?: string;
  userId: string;
  role: string;
  permissions: string[];
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  databaseName: string;
}

@Injectable()
export class TenantService {
  private tenantConnections: Map<string, PrismaClient> = new Map();

  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  async createOrganization(name: string, billingEmail: string): Promise<{ organizationId: string; databaseName: string }> {
    const organizationId = crypto.randomUUID();
    const databaseName = `tenant_org_${organizationId.replace(/-/g, '')}`;

    try {
      // Create organization in master database
      const organization = await this.databaseService.organization.create({
        data: {
          id: organizationId,
          name,
          databaseName,
          billingAccount: {
            create: {
              billingEmail,
            },
          },
        },
        include: {
          billingAccount: true,
        },
      });

      // In a real implementation, you would create a separate database here
      // For now, we'll use the same database with proper tenant isolation
      console.log(`Created organization: ${organization.name} with database: ${databaseName}`);

      return {
        organizationId: organization.id,
        databaseName: organization.databaseName,
      };
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw new BadRequestException('Failed to create organization');
    }
  }

  async getOrganizationByDatabaseName(databaseName: string) {
    return this.databaseService.organization.findUnique({
      where: { databaseName },
      include: { billingAccount: true },
    });
  }

  async getOrganizationById(organizationId: string) {
    return this.databaseService.organization.findUnique({
      where: { id: organizationId },
      include: { billingAccount: true },
    });
  }

  async getTenantConnection(organizationId: string): Promise<PrismaClient> {
    // For this implementation, we'll use the same database with proper filtering
    // In production, you would create separate databases per tenant
    
    if (!this.tenantConnections.has(organizationId)) {
      const client = new PrismaClient({
        datasources: {
          db: {
            url: this.configService.get('DATABASE_URL'),
          },
        },
      });
      
      await client.$connect();
      this.tenantConnections.set(organizationId, client);
    }

    return this.tenantConnections.get(organizationId)!;
  }

  async closeTenantConnection(organizationId: string): Promise<void> {
    const client = this.tenantConnections.get(organizationId);
    if (client) {
      await client.$disconnect();
      this.tenantConnections.delete(organizationId);
    }
  }

  async closeAllTenantConnections(): Promise<void> {
    const promises = Array.from(this.tenantConnections.keys()).map(
      (orgId) => this.closeTenantConnection(orgId)
    );
    await Promise.all(promises);
  }

  generateDatabaseName(organizationId: string): string {
    return `tenant_org_${organizationId.replace(/-/g, '')}`;
  }
}