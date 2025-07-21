import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ActivityFeedService } from './activity-feed.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityFilterDto } from './dto/activity-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContext } from '../auth/decorators/tenant-context.decorator';
import { TenantContext as ITenantContext } from '../database/tenant.service';

@UseGuards(JwtAuthGuard)
@Controller('activity-feed')
export class ActivityFeedController {
  constructor(private readonly activityFeedService: ActivityFeedService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.activityFeedService.create(createActivityDto, context);
  }

  @Get()
  async findAll(
    @Query() filterDto: ActivityFilterDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.activityFeedService.findAll(filterDto, context);
  }

  @Get('stats')
  async getStats(
    @TenantContext() context: ITenantContext,
    @Query('userId') userId?: string,
  ) {
    return this.activityFeedService.getActivityStats(context, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.activityFeedService.findOne(id, context);
  }
}