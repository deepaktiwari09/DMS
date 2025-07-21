import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { CreateInventoryViewDto } from './dto/create-inventory-view.dto';
import { UpdateInventoryViewDto } from './dto/update-inventory-view.dto';

@Injectable()
export class InventoryService {
  constructor(private tenantService: TenantService) {}

  async create(createInventoryDto: CreateInventoryDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if SKU already exists for this dealership
    const existingItem = await tenantDb.inventory.findFirst({
      where: {
        sku: createInventoryDto.sku,
        dealershipId: createInventoryDto.dealershipId,
      },
    });

    if (existingItem) {
      throw new BadRequestException('Item with this SKU already exists for this dealership');
    }

    // Verify dealership exists and belongs to organization
    const dealership = await tenantDb.dealership.findFirst({
      where: {
        id: createInventoryDto.dealershipId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!dealership) {
      throw new NotFoundException('Dealership not found');
    }

    const inventoryItem = await tenantDb.inventory.create({
      data: createInventoryDto,
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return inventoryItem;
  }

  async findAll(filterDto: InventoryFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      search,
      dealershipId,
      type,
      category,
      stockStatus,
      minPrice,
      maxPrice,
      supplierName,
      isActive,
      sortBy = 'name',
      sortOrder = 'asc',
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
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (stockStatus) {
      switch (stockStatus) {
        case 'out_of_stock':
          where.quantityOnHand = 0;
          break;
        case 'low_stock':
          where.AND = [
            { quantityOnHand: { gt: 0 } },
            { quantityOnHand: { lte: { reorderPoint: true } } },
          ];
          break;
        case 'in_stock':
          where.quantityOnHand = { gt: 0 };
          break;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.sellingPrice = {};
      if (minPrice !== undefined) where.sellingPrice.gte = minPrice;
      if (maxPrice !== undefined) where.sellingPrice.lte = maxPrice;
    }

    if (supplierName) {
      where.supplierInfo = {
        path: ['name'],
        string_contains: supplierName,
      };
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // Get total count
    const total = await tenantDb.inventory.count({ where });

    let items;
    
    if (groupBy) {
      // Handle grouping
      items = await this.getGroupedInventory(tenantDb, where, groupBy, sortBy, sortOrder, skip, limit);
    } else {
      // Regular listing
      items = await tenantDb.inventory.findMany({
        where,
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
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
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        groupBy: groupBy || null,
      },
    };
  }

  private async getGroupedInventory(tenantDb: any, where: any, groupBy: string, sortBy: string, sortOrder: string, skip: number, limit: number) {
    const groupField = this.getGroupField(groupBy);
    
    if (groupBy === 'stockStatus') {
      // Special handling for stock status grouping
      const [outOfStock, lowStock, inStock] = await Promise.all([
        tenantDb.inventory.findMany({
          where: { ...where, quantityOnHand: 0 },
          include: { dealership: { select: { id: true, name: true } } },
          orderBy: { [sortBy]: sortOrder },
        }),
        tenantDb.inventory.findMany({
          where: { 
            ...where, 
            AND: [
              { quantityOnHand: { gt: 0 } },
              { quantityOnHand: { lte: { reorderPoint: true } } },
            ]
          },
          include: { dealership: { select: { id: true, name: true } } },
          orderBy: { [sortBy]: sortOrder },
        }),
        tenantDb.inventory.findMany({
          where: { ...where, quantityOnHand: { gt: 0 } },
          include: { dealership: { select: { id: true, name: true } } },
          orderBy: { [sortBy]: sortOrder },
        }),
      ]);

      return {
        'Out of Stock': outOfStock,
        'Low Stock': lowStock,
        'In Stock': inStock,
      };
    }

    // Regular field grouping
    const groups = await tenantDb.inventory.groupBy({
      by: [groupField],
      where,
      _count: true,
    });

    const groupedData: Record<string, any> = {};
    for (const group of groups) {
      const groupValue = group[groupField] || 'Uncategorized';
      const items = await tenantDb.inventory.findMany({
        where: { ...where, [groupField]: group[groupField] },
        include: { dealership: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: sortOrder },
      });
      groupedData[groupValue] = items;
    }

    return groupedData;
  }

  private getGroupField(groupBy: string): string {
    const fieldMap: Record<string, string> = {
      type: 'type',
      category: 'category',
      supplier: 'supplierInfo',
    };
    return fieldMap[groupBy] || 'type';
  }

  async findOne(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const item = await tenantDb.inventory.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const existingItem = await tenantDb.inventory.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const updatedItem = await tenantDb.inventory.update({
      where: { id },
      data: updateInventoryDto,
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedItem;
  }

  async updateStock(id: string, updateStockDto: UpdateStockDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const existingItem = await tenantDb.inventory.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Inventory item not found');
    }

    let newQuantity: number;
    switch (updateStockDto.type) {
      case 'add':
        newQuantity = existingItem.quantityOnHand + updateStockDto.quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, existingItem.quantityOnHand - updateStockDto.quantity);
        break;
      case 'set':
        newQuantity = Math.max(0, updateStockDto.quantity);
        break;
      default:
        throw new BadRequestException('Invalid stock update type');
    }

    const updatedItem = await tenantDb.inventory.update({
      where: { id },
      data: { quantityOnHand: newQuantity },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log stock movement (implement activity feed later)
    // await this.activityFeedService.logActivity({
    //   userId: context.userId,
    //   entityType: 'inventory',
    //   entityId: id,
    //   action: 'stock_updated',
    //   details: {
    //     type: updateStockDto.type,
    //     quantity: updateStockDto.quantity,
    //     previousQuantity: existingItem.quantityOnHand,
    //     newQuantity,
    //     reason: updateStockDto.reason,
    //     notes: updateStockDto.notes,
    //   },
    // });

    return updatedItem;
  }

  async remove(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const item = await tenantDb.inventory.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    // Soft delete by setting isActive to false
    const deletedItem = await tenantDb.inventory.update({
      where: { id },
      data: { isActive: false },
    });

    return deletedItem;
  }

  async getLowStockItems(context: TenantContext, dealershipId?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const where: any = {
      dealership: {
        organizationId: context.organizationId,
      },
      isActive: true,
      AND: [
        { quantityOnHand: { gt: 0 } },
        { reorderPoint: { not: null } },
      ],
    };

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    const lowStockItems = await tenantDb.inventory.findMany({
      where: {
        ...where,
        quantityOnHand: { lte: { reorderPoint: true } },
      },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        quantityOnHand: 'asc',
      },
    });

    return lowStockItems;
  }

  async getInventoryStats(context: TenantContext, dealershipId?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const where: any = {
      dealership: {
        organizationId: context.organizationId,
      },
      isActive: true,
    };

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    const [
      totalItems,
      totalValue,
      outOfStock,
      lowStock,
      itemsByType,
      itemsByCategory,
    ] = await Promise.all([
      tenantDb.inventory.count({ where }),
      tenantDb.inventory.aggregate({
        where,
        _sum: {
          sellingPrice: true,
        },
      }),
      tenantDb.inventory.count({
        where: { ...where, quantityOnHand: 0 },
      }),
      tenantDb.inventory.count({
        where: {
          ...where,
          AND: [
            { quantityOnHand: { gt: 0 } },
            { reorderPoint: { not: null } },
            { quantityOnHand: { lte: { reorderPoint: true } } },
          ],
        },
      }),
      tenantDb.inventory.groupBy({
        by: ['type'],
        where,
        _count: true,
        _sum: {
          quantityOnHand: true,
        },
      }),
      tenantDb.inventory.groupBy({
        by: ['category'],
        where: { ...where, category: { not: null } },
        _count: true,
      }),
    ]);

    return {
      totalItems,
      totalValue: totalValue._sum.sellingPrice || 0,
      outOfStock,
      lowStock,
      inStock: totalItems - outOfStock,
      itemsByType: itemsByType.reduce((acc: Record<string, any>, item) => {
        acc[item.type] = {
          count: item._count,
          quantity: item._sum.quantityOnHand || 0,
        };
        return acc;
      }, {}),
      itemsByCategory: itemsByCategory.reduce((acc: Record<string, any>, item) => {
        acc[item.category || 'Uncategorized'] = item._count;
        return acc;
      }, {}),
    };
  }

  // Custom Views Management
  async createView(createViewDto: CreateInventoryViewDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if view name already exists for this user
    const existingView = await tenantDb.inventoryView.findFirst({
      where: {
        name: createViewDto.name,
        userId: context.userId,
      },
    });

    if (existingView) {
      throw new BadRequestException('A view with this name already exists');
    }

    const view = await tenantDb.inventoryView.create({
      data: {
        name: createViewDto.name,
        description: createViewDto.description,
        dealershipId: createViewDto.dealershipId,
        isDefault: createViewDto.isDefault,
        isShared: createViewDto.isShared,
        filterConfig: createViewDto.filterConfig as any,
        sortConfig: createViewDto.sortConfig as any,
        groupConfig: createViewDto.groupConfig as any,
        userId: context.userId,
      },
    });

    return view;
  }

  async findAllViews(context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const views = await tenantDb.inventoryView.findMany({
      where: {
        OR: [
          { userId: context.userId },
          { isShared: true },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    });

    return views;
  }

  async findOneView(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const view = await tenantDb.inventoryView.findFirst({
      where: {
        id,
        OR: [
          { userId: context.userId },
          { isShared: true },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!view) {
      throw new NotFoundException('View not found');
    }

    return view;
  }

  async updateView(id: string, updateViewDto: UpdateInventoryViewDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const view = await tenantDb.inventoryView.findFirst({
      where: {
        id,
        userId: context.userId, // Only owner can update
      },
    });

    if (!view) {
      throw new NotFoundException('View not found or not authorized');
    }

    const updatedView = await tenantDb.inventoryView.update({
      where: { id },
      data: {
        ...updateViewDto,
        filterConfig: updateViewDto.filterConfig as any,
        sortConfig: updateViewDto.sortConfig as any,
        groupConfig: updateViewDto.groupConfig as any,
      },
    });

    return updatedView;
  }

  async removeView(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const view = await tenantDb.inventoryView.findFirst({
      where: {
        id,
        userId: context.userId, // Only owner can delete
      },
    });

    if (!view) {
      throw new NotFoundException('View not found or not authorized');
    }

    await tenantDb.inventoryView.delete({ where: { id } });

    return { message: 'View deleted successfully' };
  }

  async applyView(viewId: string, context: TenantContext, additionalFilters?: Partial<InventoryFilterDto>) {
    const view = await this.findOneView(viewId, context);
    
    // Type-safe access to JSON fields
    const filterConfig = view.filterConfig as any;
    const sortConfig = view.sortConfig as any;
    const groupConfig = view.groupConfig as any;
    
    // Merge view filters with additional filters
    const mergedFilters: InventoryFilterDto = {
      ...filterConfig,
      ...additionalFilters,
      sortBy: sortConfig?.field || 'name',
      sortOrder: sortConfig?.order || 'asc',
      groupBy: groupConfig?.field,
    };

    return this.findAll(mergedFilters, context);
  }
}