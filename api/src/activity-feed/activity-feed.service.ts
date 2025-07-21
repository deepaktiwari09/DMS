import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityFilterDto } from './dto/activity-filter.dto';

@Injectable()
export class ActivityFeedService {
  constructor(private tenantService: TenantService) {}

  async create(createDto: CreateActivityDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Verify user exists
    const user = await tenantDb.user.findFirst({
      where: {
        id: createDto.userId,
        organizationId: context.organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activity = await tenantDb.activityFeed.create({
      data: {
        userId: createDto.userId,
        dealershipId: createDto.dealershipId,
        entityType: createDto.entityType,
        entityId: createDto.entityId,
        action: createDto.action,
        details: createDto.details as any,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return activity;
  }

  async findAll(filterDto: ActivityFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      userId,
      dealershipId,
      entityType,
      entityId,
      action,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      groupBy,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      user: {
        organizationId: context.organizationId,
      },
    };

    if (userId) {
      where.userId = userId;
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (action) {
      where.action = action;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Get total count
    const total = await tenantDb.activityFeed.count({ where });

    let activities;

    if (groupBy) {
      activities = await this.getGroupedActivities(tenantDb, where, groupBy, sortBy, sortOrder);
    } else {
      activities = await tenantDb.activityFeed.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
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
      data: activities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        groupBy: groupBy || null,
      },
    };
  }

  private async getGroupedActivities(tenantDb: any, where: any, groupBy: string, sortBy: string, sortOrder: string) {
    if (groupBy === 'date') {
      // Group by date (day)
      const activities = await tenantDb.activityFeed.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      });

      const groupedData: Record<string, any> = {};
      activities.forEach((activity: any) => {
        const date = activity.createdAt.toISOString().split('T')[0];
        if (!groupedData[date]) {
          groupedData[date] = [];
        }
        groupedData[date].push(activity);
      });

      return groupedData;
    }

    if (groupBy === 'entityType') {
      const groupedData: Record<string, any> = {};
      const entityTypes = ['customer', 'sale', 'service', 'inventory'];
      
      for (const entityType of entityTypes) {
        const activities = await tenantDb.activityFeed.findMany({
          where: { ...where, entityType },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, role: true } },
          },
          orderBy: { [sortBy]: sortOrder },
        });
        groupedData[entityType] = activities;
      }
      
      return groupedData;
    }

    // For other groupings, return ungrouped for now
    return await tenantDb.activityFeed.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async findOne(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const activity = await tenantDb.activityFeed.findFirst({
      where: {
        id,
        user: {
          organizationId: context.organizationId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  async getActivityStats(context: TenantContext, userId?: string) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const where: any = {
      user: {
        organizationId: context.organizationId,
      },
    };

    if (userId) {
      where.userId = userId;
    }

    const [
      totalActivities,
      activitiesByAction,
      activitiesByEntityType,
      recentActivities,
    ] = await Promise.all([
      tenantDb.activityFeed.count({ where }),
      tenantDb.activityFeed.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      tenantDb.activityFeed.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      }),
      tenantDb.activityFeed.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalActivities,
      activitiesByAction: activitiesByAction.reduce((acc: Record<string, any>, item: any) => {
        acc[item.action] = item._count;
        return acc;
      }, {}),
      activitiesByEntityType: activitiesByEntityType.reduce((acc: Record<string, any>, item: any) => {
        acc[item.entityType] = item._count;
        return acc;
      }, {}),
      recentActivities,
    };
  }

  // Helper methods to create common activity types
  async logEntityCreation(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    context: TenantContext,
    dealershipId?: string,
    details?: Record<string, any>,
  ) {
    return this.create(
      {
        userId,
        dealershipId,
        entityType,
        entityId,
        action: 'created',
        details: { entityName, ...details },
      },
      context,
    );
  }

  async logEntityUpdate(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    context: TenantContext,
    dealershipId?: string,
    details?: Record<string, any>,
  ) {
    return this.create(
      {
        userId,
        dealershipId,
        entityType,
        entityId,
        action: 'updated',
        details: { entityName, ...details },
      },
      context,
    );
  }

  async logEntityDeletion(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    context: TenantContext,
    dealershipId?: string,
    details?: Record<string, any>,
  ) {
    return this.create(
      {
        userId,
        dealershipId,
        entityType,
        entityId,
        action: 'deleted',
        details: { entityName, ...details },
      },
      context,
    );
  }

  async logEntityTransfer(
    userId: string,
    entityType: string,
    entityId: string,
    entityName: string,
    context: TenantContext,
    dealershipId?: string,
    details?: Record<string, any>,
  ) {
    return this.create(
      {
        userId,
        dealershipId,
        entityType,
        entityId,
        action: 'transferred',
        details: { entityName, ...details },
      },
      context,
    );
  }
}