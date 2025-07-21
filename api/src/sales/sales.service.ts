import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesFilterDto } from './dto/sales-filter.dto';
import { UpdateSaleStageDto } from './dto/update-sale-stage.dto';

@Injectable()
export class SalesService {
  private readonly validStages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  private readonly closedStages = ['closed_won', 'closed_lost'];

  constructor(private tenantService: TenantService) {}

  async create(createSaleDto: CreateSaleDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Verify customer exists
    const customer = await tenantDb.customer.findFirst({
      where: {
        id: createSaleDto.customerId,
        organizationId: context.organizationId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Verify dealership exists
    const dealership = await tenantDb.dealership.findFirst({
      where: {
        id: createSaleDto.dealershipId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!dealership) {
      throw new NotFoundException('Dealership not found');
    }

    // Verify sales person if provided
    if (createSaleDto.salesPersonId) {
      const salesPerson = await tenantDb.user.findFirst({
        where: {
          id: createSaleDto.salesPersonId,
          organizationId: context.organizationId,
          isActive: true,
        },
      });

      if (!salesPerson) {
        throw new NotFoundException('Sales person not found');
      }
    }

    // Calculate total amount from items if not provided
    let totalAmount = createSaleDto.totalAmount;
    if (!totalAmount && createSaleDto.items && createSaleDto.items.length > 0) {
      totalAmount = createSaleDto.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice;
        const discount = item.discount || 0;
        return sum + (itemTotal - discount);
      }, 0);
    }

    const sale = await tenantDb.sale.create({
      data: {
        customerId: createSaleDto.customerId,
        dealershipId: createSaleDto.dealershipId,
        salesPersonId: createSaleDto.salesPersonId,
        stage: createSaleDto.stage || 'lead',
        totalAmount,
        items: (createSaleDto.items || []) as any,
        notes: createSaleDto.notes,
        estimatedCloseDate: createSaleDto.estimatedCloseDate ? new Date(createSaleDto.estimatedCloseDate) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
        salesPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return sale;
  }

  async findAll(filterDto: SalesFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      search,
      dealershipId,
      salesPersonId,
      customerId,
      stage,
      stages,
      priority,
      source,
      minAmount,
      maxAmount,
      estimatedCloseDateFrom,
      estimatedCloseDateTo,
      createdDateFrom,
      createdDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      groupBy,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      dealership: {
        organizationId: context.organizationId,
      },
    };

    if (search) {
      where.OR = [
        {
          customer: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (salesPersonId) {
      where.salesPersonId = salesPersonId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (stage) {
      where.stage = stage;
    }

    if (stages && stages.length > 0) {
      where.stage = { in: stages };
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.totalAmount = {};
      if (minAmount !== undefined) where.totalAmount.gte = minAmount;
      if (maxAmount !== undefined) where.totalAmount.lte = maxAmount;
    }

    if (estimatedCloseDateFrom || estimatedCloseDateTo) {
      where.estimatedCloseDate = {};
      if (estimatedCloseDateFrom) where.estimatedCloseDate.gte = new Date(estimatedCloseDateFrom);
      if (estimatedCloseDateTo) where.estimatedCloseDate.lte = new Date(estimatedCloseDateTo);
    }

    if (createdDateFrom || createdDateTo) {
      where.createdAt = {};
      if (createdDateFrom) where.createdAt.gte = new Date(createdDateFrom);
      if (createdDateTo) where.createdAt.lte = new Date(createdDateTo);
    }

    // Get total count
    const total = await tenantDb.sale.count({ where });

    let sales;

    if (groupBy) {
      sales = await this.getGroupedSales(tenantDb, where, groupBy, sortBy, sortOrder, skip, limit);
    } else {
      sales = await tenantDb.sale.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          dealership: {
            select: {
              id: true,
              name: true,
            },
          },
          salesPerson: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      });
    }

    return {
      data: sales,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        groupBy: groupBy || null,
      },
    };
  }

  private async getGroupedSales(tenantDb: any, where: any, groupBy: string, sortBy: string, sortOrder: string, skip: number, limit: number) {
    const groupField = this.getGroupField(groupBy);
    
    if (groupBy === 'stage') {
      // Group by sales stage
      const groupedData: Record<string, any> = {};
      
      for (const stage of this.validStages) {
        const sales = await tenantDb.sale.findMany({
          where: { ...where, stage },
          include: {
            customer: { select: { id: true, firstName: true, lastName: true, email: true } },
            dealership: { select: { id: true, name: true } },
            salesPerson: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { [sortBy]: sortOrder },
        });
        groupedData[stage] = sales;
      }
      
      return groupedData;
    }

    // Regular field grouping
    const groups = await tenantDb.sale.groupBy({
      by: [groupField],
      where,
      _count: true,
      _sum: {
        totalAmount: true,
      },
    });

    const groupedData: Record<string, any> = {};
    for (const group of groups) {
      const groupValue = group[groupField] || 'Unassigned';
      const sales = await tenantDb.sale.findMany({
        where: { ...where, [groupField]: group[groupField] },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, email: true } },
          dealership: { select: { id: true, name: true } },
          salesPerson: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      });
      groupedData[groupValue] = {
        sales,
        count: group._count,
        totalValue: group._sum.totalAmount || 0,
      };
    }

    return groupedData;
  }

  private getGroupField(groupBy: string): string {
    const fieldMap: Record<string, string> = {
      salesPerson: 'salesPersonId',
      priority: 'priority',
      source: 'source',
    };
    return fieldMap[groupBy] || 'stage';
  }

  async findOne(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const sale = await tenantDb.sale.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        dealership: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        salesPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const existingSale = await tenantDb.sale.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!existingSale) {
      throw new NotFoundException('Sale not found');
    }

    // Check if sale is already closed
    if (this.closedStages.includes(existingSale.stage)) {
      throw new BadRequestException('Cannot update a closed sale');
    }

    // Verify sales person if being updated
    if (updateSaleDto.salesPersonId) {
      const salesPerson = await tenantDb.user.findFirst({
        where: {
          id: updateSaleDto.salesPersonId,
          organizationId: context.organizationId,
          isActive: true,
        },
      });

      if (!salesPerson) {
        throw new NotFoundException('Sales person not found');
      }
    }

    // Calculate total amount from items if provided
    let totalAmount = updateSaleDto.totalAmount;
    if (!totalAmount && updateSaleDto.items && updateSaleDto.items.length > 0) {
      totalAmount = updateSaleDto.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice;
        const discount = item.discount || 0;
        return sum + (itemTotal - discount);
      }, 0);
    }

    const updateData: any = {
      ...updateSaleDto,
      totalAmount,
    };

    // Handle date fields
    if (updateSaleDto.estimatedCloseDate) {
      updateData.estimatedCloseDate = new Date(updateSaleDto.estimatedCloseDate);
    }
    if (updateSaleDto.actualCloseDate) {
      updateData.actualCloseDate = new Date(updateSaleDto.actualCloseDate);
    }

    const updatedSale = await tenantDb.sale.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
        salesPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedSale;
  }

  async updateStage(id: string, updateStageDto: UpdateSaleStageDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const sale = await tenantDb.sale.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Validate stage transition
    if (!this.validStages.includes(updateStageDto.stage)) {
      throw new BadRequestException(`Invalid stage: ${updateStageDto.stage}`);
    }

    // Check if moving to closed_lost requires reason
    if (updateStageDto.stage === 'closed_lost' && !updateStageDto.lostReason) {
      throw new BadRequestException('Lost reason is required when closing as lost');
    }

    const updateData: any = {
      stage: updateStageDto.stage,
      notes: updateStageDto.notes ? `${sale.notes || ''}\n\nStage Update: ${updateStageDto.notes}` : sale.notes,
    };

    // Set actual close date for closed stages
    if (this.closedStages.includes(updateStageDto.stage)) {
      updateData.actualCloseDate = new Date();
    }

    if (updateStageDto.estimatedCloseDate) {
      updateData.estimatedCloseDate = new Date(updateStageDto.estimatedCloseDate);
    }

    const updatedSale = await tenantDb.sale.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        salesPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update customer lifetime value if sale is won
    if (updateStageDto.stage === 'closed_won' && sale.totalAmount) {
      await tenantDb.customer.update({
        where: { id: sale.customerId },
        data: {
          lifetimeValue: {
            increment: sale.totalAmount,
          },
        },
      });
    }

    return updatedSale;
  }

  async remove(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const sale = await tenantDb.sale.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Only allow deletion of non-closed sales
    if (this.closedStages.includes(sale.stage)) {
      throw new BadRequestException('Cannot delete a closed sale');
    }

    await tenantDb.sale.delete({ where: { id } });

    return { message: 'Sale deleted successfully' };
  }

  async getSalesStats(context: TenantContext, dealershipId?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const where: any = {
      dealership: {
        organizationId: context.organizationId,
      },
    };

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    const [
      totalSales,
      activeSales,
      closedWonSales,
      closedLostSales,
      totalRevenue,
      salesByStage,
      salesBySalesPerson,
      averageSaleValue,
    ] = await Promise.all([
      tenantDb.sale.count({ where }),
      tenantDb.sale.count({
        where: { ...where, stage: { notIn: this.closedStages } },
      }),
      tenantDb.sale.count({
        where: { ...where, stage: 'closed_won' },
      }),
      tenantDb.sale.count({
        where: { ...where, stage: 'closed_lost' },
      }),
      tenantDb.sale.aggregate({
        where: { ...where, stage: 'closed_won' },
        _sum: { totalAmount: true },
      }),
      tenantDb.sale.groupBy({
        by: ['stage'],
        where,
        _count: true,
        _sum: { totalAmount: true },
      }),
      tenantDb.sale.groupBy({
        by: ['salesPersonId'],
        where: { ...where, salesPersonId: { not: null } },
        _count: true,
        _sum: { totalAmount: true },
      }),
      tenantDb.sale.aggregate({
        where: { ...where, stage: 'closed_won' },
        _avg: { totalAmount: true },
      }),
    ]);

    // Calculate conversion rate after resolving the counts
    const conversionRate = closedWonSales / (closedWonSales + closedLostSales || 1) * 100;

    return {
      totalSales,
      activeSales,
      closedWonSales,
      closedLostSales,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      averageSaleValue: averageSaleValue._avg.totalAmount || 0,
      conversionRate: Number(((closedWonSales / ((closedWonSales + closedLostSales) || 1)) * 100).toFixed(2)),
      salesByStage: salesByStage.reduce((acc: Record<string, any>, item) => {
        acc[item.stage] = {
          count: item._count,
          value: item._sum.totalAmount || 0,
        };
        return acc;
      }, {}),
      salesBySalesPerson: salesBySalesPerson.length,
    };
  }

  async getPipeline(context: TenantContext, dealershipId?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const where: any = {
      dealership: {
        organizationId: context.organizationId,
      },
      stage: { notIn: this.closedStages },
    };

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    const pipeline = await tenantDb.sale.groupBy({
      by: ['stage'],
      where,
      _count: true,
      _sum: { totalAmount: true },
    });

    const pipelineData: Record<string, any> = {};
    for (const stage of ['lead', 'qualified', 'proposal', 'negotiation']) {
      const stageData = pipeline.find(p => p.stage === stage);
      pipelineData[stage] = {
        count: stageData?._count || 0,
        value: stageData?._sum.totalAmount || 0,
      };
    }

    return pipelineData;
  }

  async assignSalesPerson(id: string, salesPersonId: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Verify sale exists
    const sale = await tenantDb.sale.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Verify sales person exists
    const salesPerson = await tenantDb.user.findFirst({
      where: {
        id: salesPersonId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!salesPerson) {
      throw new NotFoundException('Sales person not found');
    }

    const updatedSale = await tenantDb.sale.update({
      where: { id },
      data: { salesPersonId },
      include: {
        salesPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedSale;
  }
}