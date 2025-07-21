import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TenantService } from '../database/tenant.service';
import { CreateDealershipDto } from './dto/create-dealership.dto';
import { UpdateDealershipDto } from './dto/update-dealership.dto';
import { DealershipFilterDto } from './dto/dealership-filter.dto';

@Injectable()
export class DealershipsService {
  constructor(private tenantService: TenantService) {}

  async create(organizationId: string, createDealershipDto: CreateDealershipDto) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    return tenantDb.dealership.create({
      data: {
        ...createDealershipDto,
        organizationId,
      },
      include: {
        _count: {
          select: {
            users: true,
            inventory: true,
            customers: true,
            sales: true,
            serviceAppointments: true,
          },
        },
      },
    });
  }

  async findAll(organizationId: string, filters: DealershipFilterDto = {}) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);
    
    const {
      search,
      isActive,
      timezone,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {
      organizationId,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (timezone) {
      where.timezone = timezone;
    }

    const skip = (page - 1) * limit;

    const [dealerships, total] = await Promise.all([
      tenantDb.dealership.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              inventory: true,
              customers: true,
              sales: true,
              serviceAppointments: true,
            },
          },
        },
      }),
      tenantDb.dealership.count({ where }),
    ]);

    return {
      data: dealerships,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(organizationId: string, id: string, userId?: string, userRole?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    const dealership = await tenantDb.dealership.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            inventory: true,
            customers: true,
            sales: true,
            serviceAppointments: true,
          },
        },
      },
    });

    if (!dealership) {
      throw new NotFoundException('Dealership not found');
    }

    // Check if dealership belongs to the organization
    if (dealership.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied to this dealership');
    }

    // Additional role-based access control could be added here
    // For now, we'll allow all authenticated users within the org to view dealerships

    return dealership;
  }

  async update(organizationId: string, id: string, updateDealershipDto: UpdateDealershipDto) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    // First verify the dealership exists and belongs to this organization
    await this.findOne(organizationId, id);

    return tenantDb.dealership.update({
      where: { id },
      data: updateDealershipDto,
      include: {
        _count: {
          select: {
            users: true,
            inventory: true,
            customers: true,
            sales: true,
            serviceAppointments: true,
          },
        },
      },
    });
  }

  async remove(organizationId: string, id: string) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    // First verify the dealership exists and belongs to this organization
    await this.findOne(organizationId, id);

    // Soft delete by setting isActive to false
    return tenantDb.dealership.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats(organizationId: string, id: string) {
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    // Verify dealership exists and belongs to this organization
    await this.findOne(organizationId, id);

    const [
      totalUsers,
      activeUsers,
      totalInventory,
      lowStockItems,
      totalCustomers,
      activeSales,
      scheduledAppointments,
    ] = await Promise.all([
      tenantDb.user.count({ where: { dealershipId: id } }),
      tenantDb.user.count({ where: { dealershipId: id, isActive: true } }),
      tenantDb.inventory.count({ where: { dealershipId: id, isActive: true } }),
      tenantDb.inventory.count({
        where: {
          dealershipId: id,
          isActive: true,
          quantityOnHand: { lte: tenantDb.inventory.fields.reorderPoint },
        },
      }),
      tenantDb.customer.count({ where: { primaryDealershipId: id } }),
      tenantDb.sale.count({
        where: {
          dealershipId: id,
          stage: { notIn: ['closed_won', 'closed_lost'] },
        },
      }),
      tenantDb.serviceAppointment.count({
        where: {
          dealershipId: id,
          status: 'scheduled',
        },
      }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers },
      inventory: { total: totalInventory, lowStock: lowStockItems },
      customers: totalCustomers,
      sales: { active: activeSales },
      serviceAppointments: { scheduled: scheduledAppointments },
    };
  }
}