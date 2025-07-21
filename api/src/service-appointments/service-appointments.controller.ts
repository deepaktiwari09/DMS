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
import { ServiceAppointmentsService } from './service-appointments.service';
import { CreateServiceAppointmentDto } from './dto/create-service-appointment.dto';
import { UpdateServiceAppointmentDto } from './dto/update-service-appointment.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContext } from '../auth/decorators/tenant-context.decorator';
import { TenantContext as ITenantContext } from '../database/tenant.service';

@UseGuards(JwtAuthGuard)
@Controller('service-appointments')
export class ServiceAppointmentsController {
  constructor(private readonly serviceAppointmentsService: ServiceAppointmentsService) {}

  @Post()
  async create(
    @Body() createServiceAppointmentDto: CreateServiceAppointmentDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.serviceAppointmentsService.create(createServiceAppointmentDto, context);
  }

  @Get()
  async findAll(
    @Query() filterDto: ServiceFilterDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.serviceAppointmentsService.findAll(filterDto, context);
  }

  @Get('stats')
  async getStats(
    @TenantContext() context: ITenantContext,
    @Query('dealershipId') dealershipId?: string,
  ) {
    return this.serviceAppointmentsService.getServiceStats(context, dealershipId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.serviceAppointmentsService.findOne(id, context);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceAppointmentDto: UpdateServiceAppointmentDto,
    @TenantContext() context: ITenantContext,
  ) {
    return this.serviceAppointmentsService.update(id, updateServiceAppointmentDto, context);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantContext() context: ITenantContext,
  ) {
    return this.serviceAppointmentsService.remove(id, context);
  }
}