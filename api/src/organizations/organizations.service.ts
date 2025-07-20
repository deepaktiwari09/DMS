import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TenantService } from '../database/tenant.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private databaseService: DatabaseService,
    private tenantService: TenantService,
  ) {}

  async findAll() {
    return this.databaseService.organization.findMany({
      where: { isActive: true },
      include: {
        billingAccount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.databaseService.organization.findUnique({
      where: { id },
      include: {
        billingAccount: true,
      },
    });
  }

  async getOrganizationStats(organizationId: string) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);
    
    const [
      dealershipsCount,
      usersCount,
      customersCount,
      activeSalesCount,
      inventoryCount,
    ] = await Promise.all([
      tenantDb.dealership.count({ where: { isActive: true } }),
      tenantDb.user.count({ where: { isActive: true } }),
      tenantDb.customer.count(),
      tenantDb.sale.count({ 
        where: { 
          stage: { 
            notIn: ['closed_won', 'closed_lost'] 
          } 
        } 
      }),
      tenantDb.inventory.count({ where: { isActive: true } }),
    ]);

    return {
      dealerships: dealershipsCount,
      users: usersCount,
      customers: customersCount,
      activeSales: activeSalesCount,
      inventory: inventoryCount,
    };
  }
}