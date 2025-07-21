import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateServiceAppointmentDto } from './dto/create-service-appointment.dto';
import { UpdateServiceAppointmentDto } from './dto/update-service-appointment.dto';
import { ServiceFilterDto } from './dto/service-filter.dto';

@Injectable()
export class ServiceAppointmentsService {
  private readonly validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
  private readonly completedStatuses = ['completed', 'cancelled'];

  constructor(private tenantService: TenantService) {}

  async create(createDto: CreateServiceAppointmentDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Verify customer exists
    const customer = await tenantDb.customer.findFirst({
      where: {
        id: createDto.customerId,
        organizationId: context.organizationId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Verify dealership exists
    const dealership = await tenantDb.dealership.findFirst({
      where: {
        id: createDto.dealershipId,
        organizationId: context.organizationId,
        isActive: true,
      },
    });

    if (!dealership) {
      throw new NotFoundException('Dealership not found');
    }

    // Verify technician if provided
    if (createDto.technicianId) {
      const technician = await tenantDb.user.findFirst({
        where: {
          id: createDto.technicianId,
          organizationId: context.organizationId,
          isActive: true,
        },
      });

      if (!technician) {
        throw new NotFoundException('Technician not found');
      }

      // Check for conflicting appointments
      const conflict = await this.checkScheduleConflict(
        tenantDb,
        createDto.technicianId,
        new Date(createDto.scheduledStart),
        new Date(createDto.scheduledEnd),
      );

      if (conflict) {
        throw new ConflictException('Technician has conflicting appointment at this time');
      }
    }

    const appointment = await tenantDb.serviceAppointment.create({
      data: {
        customerId: createDto.customerId,
        dealershipId: createDto.dealershipId,
        technicianId: createDto.technicianId,
        vehicleInfo: createDto.vehicleInfo as any,
        serviceType: createDto.serviceType,
        status: createDto.status || 'scheduled',
        scheduledStart: new Date(createDto.scheduledStart),
        scheduledEnd: new Date(createDto.scheduledEnd),
        actualStart: createDto.actualStart ? new Date(createDto.actualStart) : null,
        actualEnd: createDto.actualEnd ? new Date(createDto.actualEnd) : null,
        laborHours: createDto.laborHours,
        partsUsed: createDto.partsUsed as any,
        totalCost: createDto.totalCost,
        notes: createDto.notes,
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
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return appointment;
  }

  private async checkScheduleConflict(
    tenantDb: any,
    technicianId: string,
    start: Date,
    end: Date,
    excludeId?: string,
  ): Promise<boolean> {
    const where: any = {
      technicianId,
      status: { notIn: this.completedStatuses },
      OR: [
        {
          AND: [
            { scheduledStart: { lte: start } },
            { scheduledEnd: { gt: start } },
          ],
        },
        {
          AND: [
            { scheduledStart: { lt: end } },
            { scheduledEnd: { gte: end } },
          ],
        },
        {
          AND: [
            { scheduledStart: { gte: start } },
            { scheduledEnd: { lte: end } },
          ],
        },
      ],
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const conflict = await tenantDb.serviceAppointment.findFirst({ where });
    return !!conflict;
  }

  async findAll(filterDto: ServiceFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      search,
      dealershipId,
      technicianId,
      customerId,
      status,
      statuses,
      serviceType,
      scheduledDateFrom,
      scheduledDateTo,
      createdDateFrom,
      createdDateTo,
      sortBy = 'scheduledStart',
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
        {
          customer: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { serviceType: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (technicianId) {
      where.technicianId = technicianId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (statuses && statuses.length > 0) {
      where.status = { in: statuses };
    }

    if (serviceType) {
      where.serviceType = { contains: serviceType, mode: 'insensitive' };
    }

    if (scheduledDateFrom || scheduledDateTo) {
      where.scheduledStart = {};
      if (scheduledDateFrom) where.scheduledStart.gte = new Date(scheduledDateFrom);
      if (scheduledDateTo) where.scheduledStart.lte = new Date(scheduledDateTo);
    }

    if (createdDateFrom || createdDateTo) {
      where.createdAt = {};
      if (createdDateFrom) where.createdAt.gte = new Date(createdDateFrom);
      if (createdDateTo) where.createdAt.lte = new Date(createdDateTo);
    }

    // Get total count
    const total = await tenantDb.serviceAppointment.count({ where });

    let appointments;

    if (groupBy) {
      appointments = await this.getGroupedAppointments(tenantDb, where, groupBy, sortBy, sortOrder);
    } else {
      appointments = await tenantDb.serviceAppointment.findMany({
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
          technician: {
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
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        groupBy: groupBy || null,
      },
    };
  }

  private async getGroupedAppointments(tenantDb: any, where: any, groupBy: string, sortBy: string, sortOrder: string) {
    if (groupBy === 'status') {
      const groupedData: Record<string, any> = {};
      
      for (const status of this.validStatuses) {
        const appointments = await tenantDb.serviceAppointment.findMany({
          where: { ...where, status },
          include: {
            customer: { select: { id: true, firstName: true, lastName: true } },
            dealership: { select: { id: true, name: true } },
            technician: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { [sortBy]: sortOrder },
        });
        groupedData[status] = appointments;
      }
      
      return groupedData;
    }

    // For other groupings, return ungrouped for now
    return await tenantDb.serviceAppointment.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        dealership: { select: { id: true, name: true } },
        technician: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async findOne(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const appointment = await tenantDb.serviceAppointment.findFirst({
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
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Service appointment not found');
    }

    return appointment;
  }

  async update(id: string, updateDto: UpdateServiceAppointmentDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const existingAppointment = await tenantDb.serviceAppointment.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!existingAppointment) {
      throw new NotFoundException('Service appointment not found');
    }

    // Check if appointment is already completed
    if (this.completedStatuses.includes(existingAppointment.status)) {
      throw new BadRequestException('Cannot update a completed or cancelled appointment');
    }

    const updateData: any = { ...updateDto };

    // Handle date fields
    if (updateDto.scheduledStart) {
      updateData.scheduledStart = new Date(updateDto.scheduledStart);
    }
    if (updateDto.scheduledEnd) {
      updateData.scheduledEnd = new Date(updateDto.scheduledEnd);
    }
    if (updateDto.actualStart) {
      updateData.actualStart = new Date(updateDto.actualStart);
    }
    if (updateDto.actualEnd) {
      updateData.actualEnd = new Date(updateDto.actualEnd);
    }

    // Handle JSON fields
    if (updateDto.vehicleInfo) {
      updateData.vehicleInfo = updateDto.vehicleInfo as any;
    }
    if (updateDto.partsUsed) {
      updateData.partsUsed = updateDto.partsUsed as any;
    }

    const updatedAppointment = await tenantDb.serviceAppointment.update({
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
        technician: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedAppointment;
  }

  async remove(id: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const appointment = await tenantDb.serviceAppointment.findFirst({
      where: {
        id,
        dealership: {
          organizationId: context.organizationId,
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Service appointment not found');
    }

    // Only allow deletion of scheduled appointments
    if (appointment.status !== 'scheduled') {
      throw new BadRequestException('Can only delete scheduled appointments');
    }

    await tenantDb.serviceAppointment.delete({ where: { id } });

    return { message: 'Service appointment deleted successfully' };
  }

  async getServiceStats(context: TenantContext, dealershipId?: string) {
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
      totalAppointments,
      scheduledAppointments,
      inProgressAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      tenantDb.serviceAppointment.count({ where }),
      tenantDb.serviceAppointment.count({
        where: { ...where, status: 'scheduled' },
      }),
      tenantDb.serviceAppointment.count({
        where: { ...where, status: 'in_progress' },
      }),
      tenantDb.serviceAppointment.count({
        where: { ...where, status: 'completed' },
      }),
      tenantDb.serviceAppointment.count({
        where: { ...where, status: 'cancelled' },
      }),
    ]);

    return {
      totalAppointments,
      scheduledAppointments,
      inProgressAppointments,
      completedAppointments,
      cancelledAppointments,
    };
  }
}