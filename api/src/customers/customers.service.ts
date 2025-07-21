import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerSearchDto } from './dto/customer-search.dto';
import { TransferCustomerDto } from './dto/transfer-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private tenantService: TenantService) {}

  async create(createCustomerDto: CreateCustomerDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if customer with same email already exists
    if (createCustomerDto.email) {
      const existingCustomer = await tenantDb.customer.findFirst({
        where: {
          email: createCustomerDto.email,
          organizationId: context.organizationId,
        },
      });

      if (existingCustomer) {
        throw new BadRequestException('Customer with this email already exists');
      }
    }

    const customer = await tenantDb.customer.create({
      data: {
        ...createCustomerDto,
        organizationId: context.organizationId,
        lifetimeValue: 0,
      },
      include: {
        primaryDealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return customer;
  }

  async findAll(searchDto: CustomerSearchDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      search,
      primaryDealershipId,
      city,
      state,
      preferredContactMethod,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = searchDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      organizationId: context.organizationId,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (primaryDealershipId) {
      where.primaryDealershipId = primaryDealershipId;
    }

    if (city) {
      where.address = {
        path: ['city'],
        string_contains: city,
      };
    }

    if (state) {
      where.address = {
        path: ['state'],
        string_contains: state,
      };
    }

    if (preferredContactMethod) {
      where.preferences = {
        path: ['preferredContactMethod'],
        equals: preferredContactMethod,
      };
    }

    // Get total count
    const total = await tenantDb.customer.count({ where });

    // Get customers
    const customers = await tenantDb.customer.findMany({
      where,
      include: {
        primaryDealership: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            sales: true,
            serviceAppointments: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const customer = await tenantDb.customer.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
      include: {
        primaryDealership: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        sales: {
          select: {
            id: true,
            stage: true,
            totalAmount: true,
            createdAt: true,
            dealership: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        serviceAppointments: {
          select: {
            id: true,
            serviceType: true,
            status: true,
            scheduledStart: true,
            totalCost: true,
            dealership: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            scheduledStart: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if customer exists
    const existingCustomer = await tenantDb.customer.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if email is being changed and if it conflicts
    if (updateCustomerDto.email && updateCustomerDto.email !== existingCustomer.email) {
      const emailConflict = await tenantDb.customer.findFirst({
        where: {
          email: updateCustomerDto.email,
          organizationId: context.organizationId,
          id: { not: id },
        },
      });

      if (emailConflict) {
        throw new BadRequestException('Another customer with this email already exists');
      }
    }

    const updatedCustomer = await tenantDb.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        primaryDealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedCustomer;
  }

  async remove(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const customer = await tenantDb.customer.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if customer has associated sales or service appointments
    const [salesCount, serviceCount] = await Promise.all([
      tenantDb.sale.count({ where: { customerId: id } }),
      tenantDb.serviceAppointment.count({ where: { customerId: id } }),
    ]);

    if (salesCount > 0 || serviceCount > 0) {
      throw new BadRequestException(
        'Cannot delete customer with existing sales or service records. Consider transferring the customer instead.'
      );
    }

    await tenantDb.customer.delete({ where: { id } });

    return { message: 'Customer deleted successfully' };
  }

  async transferCustomer(id: string, transferDto: TransferCustomerDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if customer exists
    const customer = await tenantDb.customer.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Check if target dealership exists
    const targetDealership = await tenantDb.dealership.findFirst({
      where: {
        id: transferDto.toDealershipId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!targetDealership) {
      throw new NotFoundException('Target dealership not found');
    }

    // Update customer's primary dealership
    const updatedCustomer = await tenantDb.customer.update({
      where: { id },
      data: {
        primaryDealershipId: transferDto.toDealershipId,
      },
      include: {
        primaryDealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log the transfer in activity feed (you can implement this later)
    // await this.activityFeedService.logActivity({
    //   userId: context.userId,
    //   entityType: 'customer',
    //   entityId: id,
    //   action: 'transferred',
    //   details: {
    //     fromDealership: customer.primaryDealershipId,
    //     toDealership: transferDto.toDealershipId,
    //     reason: transferDto.reason,
    //     notes: transferDto.notes,
    //   },
    // });

    return updatedCustomer;
  }

  async getCustomerStats(context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const [
      totalCustomers,
      customersByDealership,
      customersWithPurchases,
      averageLifetimeValue,
      topCustomers,
      recentCustomers,
    ] = await Promise.all([
      tenantDb.customer.count({
        where: { organizationId: context.organizationId },
      }),
      tenantDb.customer.groupBy({
        by: ['primaryDealershipId'],
        where: {
          organizationId: context.organizationId,
          primaryDealershipId: { not: null },
        },
        _count: true,
      }),
      tenantDb.customer.count({
        where: {
          organizationId: context.organizationId,
          lifetimeValue: { gt: 0 },
        },
      }),
      tenantDb.customer.aggregate({
        where: { organizationId: context.organizationId },
        _avg: { lifetimeValue: true },
      }),
      tenantDb.customer.findMany({
        where: { organizationId: context.organizationId },
        orderBy: { lifetimeValue: 'desc' },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          lifetimeValue: true,
          primaryDealership: {
            select: {
              name: true,
            },
          },
        },
      }),
      tenantDb.customer.findMany({
        where: { organizationId: context.organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          primaryDealership: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      totalCustomers,
      customersWithPurchases,
      averageLifetimeValue: averageLifetimeValue._avg.lifetimeValue || 0,
      customersByDealership: customersByDealership.length,
      topCustomers,
      recentCustomers,
    };
  }

  async updateLifetimeValue(customerId: string, amount: number, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    await tenantDb.customer.update({
      where: { id: customerId },
      data: {
        lifetimeValue: {
          increment: amount,
        },
      },
    });
  }
}