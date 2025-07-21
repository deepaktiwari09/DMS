import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationFilterDto } from './dto/notification-filter.dto';

@Injectable()
export class NotificationsService {
  constructor(private tenantService: TenantService) {}

  async create(createDto: CreateNotificationDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Verify user exists
    const user = await tenantDb.user.findFirst({
      where: {
        id: createDto.userId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = await tenantDb.notification.create({
      data: {
        userId: createDto.userId,
        type: createDto.type,
        title: createDto.title,
        message: createDto.message,
        data: createDto.data as any,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return notification;
  }

  async findAll(filterDto: NotificationFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      userId,
      type,
      isRead,
      search,
      createdDateFrom,
      createdDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
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

    if (type) {
      where.type = type;
    }

    if (isRead !== undefined) {
      if (isRead) {
        where.readAt = { not: null };
      } else {
        where.readAt = null;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (createdDateFrom || createdDateTo) {
      where.createdAt = {};
      if (createdDateFrom) where.createdAt.gte = new Date(createdDateFrom);
      if (createdDateTo) where.createdAt.lte = new Date(createdDateTo);
    }

    // Get total count
    const total = await tenantDb.notification.count({ where });

    const notifications = await tenantDb.notification.findMany({
      where,
      include: {
        user: {
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

    return {
      data: notifications,
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

    const notification = await tenantDb.notification.findFirst({
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
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(id: string, updateDto: UpdateNotificationDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const existingNotification = await tenantDb.notification.findFirst({
      where: {
        id,
        user: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!existingNotification) {
      throw new NotFoundException('Notification not found');
    }

    const updateData: any = {};

    if (updateDto.readAt) {
      updateData.readAt = new Date(updateDto.readAt);
    }

    const updatedNotification = await tenantDb.notification.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedNotification;
  }

  async markAsRead(id: string, context: TenantContext) {
    return this.update(id, { readAt: new Date().toISOString() }, context);
  }

  async markAllAsRead(userId: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const updatedNotifications = await tenantDb.notification.updateMany({
      where: {
        userId,
        readAt: null,
        user: {
          organizationId: context.organizationId,
        },
      },
      data: {
        readAt: new Date(),
      },
    });

    return { updated: updatedNotifications.count };
  }

  async remove(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const notification = await tenantDb.notification.findFirst({
      where: {
        id,
        user: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await tenantDb.notification.delete({ where: { id } });

    return { message: 'Notification deleted successfully' };
  }

  async getUnreadCount(userId: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const count = await tenantDb.notification.count({
      where: {
        userId,
        readAt: null,
        user: {
          organizationId: context.organizationId,
        },
      },
    });

    return { count };
  }

  async getNotificationStats(context: TenantContext, userId?: string) {
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
      totalNotifications,
      unreadNotifications,
      notificationsByType,
    ] = await Promise.all([
      tenantDb.notification.count({ where }),
      tenantDb.notification.count({
        where: { ...where, readAt: null },
      }),
      tenantDb.notification.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalNotifications,
      unreadNotifications,
      notificationsByType: notificationsByType.reduce((acc: Record<string, any>, item: any) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    };
  }

  // Helper method to create system notifications
  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'system',
    context: TenantContext,
    data?: Record<string, any>,
  ) {
    return this.create(
      {
        userId,
        title,
        message,
        type,
        data,
      },
      context,
    );
  }
}