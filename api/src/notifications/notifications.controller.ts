import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationFilterDto } from './dto/notification-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContext } from '../auth/decorators/tenant-context.decorator';
import { TenantContext as ITenantContext } from '../database/tenant.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.create(createNotificationDto, context);
  }

  @Get()
  async findAll(
    @Query() filterDto: NotificationFilterDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.findAll(filterDto, context);
  }

  @Get('stats')
  async getStats(
    @TenantContext() context: ITenantContext,
    @Query('userId') userId?: string,
  ) {
    return this.notificationsService.getNotificationStats(context, userId);
  }

  @Get('unread-count/:userId')
  async getUnreadCount(
    @Param('userId', ParseUUIDPipe) userId: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.getUnreadCount(userId, context);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.findOne(id, context);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.update(id, updateNotificationDto, context);
  }

  @Patch(':id/mark-read')
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.markAsRead(id, context);
  }

  @Patch('mark-all-read/:userId')
  async markAllAsRead(
    @Param('userId', ParseUUIDPipe) userId: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.markAllAsRead(userId, context);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.notificationsService.remove(id, context);
  }
}