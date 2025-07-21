import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TenantService, TenantContext } from '../database/tenant.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private tenantService: TenantService) {}

  async create(createUserDto: CreateUserDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if email already exists
    const existingUser = await tenantDb.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const user = await tenantDb.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: createUserDto.role,
        organizationId: context.organizationId,
        dealershipId: createUserDto.dealershipId,
        permissions: createUserDto.permissions || [],
        isActive: createUserDto.isActive ?? true,
      },
      include: {
        dealership: true,
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async findAll(filterDto: UserFilterDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const {
      search,
      role,
      dealershipId,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filterDto;

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
      ];
    }

    if (role) {
      where.role = role;
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    // Get total count
    const total = await tenantDb.user.count({ where });

    // Get users
    const users = await tenantDb.user.findMany({
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

    // Remove password hashes
    const usersResponse = users.map(({ passwordHash, ...user }) => user);

    return {
      data: usersResponse,
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

    const user = await tenantDb.user.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash: _, ...userResponse } = user;
    return userResponse;
  }

  async update(id: string, updateUserDto: UpdateUserDto, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if user exists
    const existingUser = await tenantDb.user.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Only allow admin or the user themselves to update
    if (context.role !== 'admin' && context.userId !== id) {
      throw new ForbiddenException('Not authorized to update this user');
    }

    // Update user
    const updatedUser = await tenantDb.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { passwordHash: _, ...userResponse } = updatedUser;
    return userResponse;
  }

  async remove(id: string, context: TenantContext) {
    if (context.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete users');
    }

    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    // Check if user exists
    const existingUser = await tenantDb.user.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Soft delete by setting isActive to false
    const deletedUser = await tenantDb.user.update({
      where: { id },
      data: { isActive: false },
    });

    const { passwordHash: _, ...userResponse } = deletedUser;
    return userResponse;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto, context: TenantContext) {
    // Only allow the user themselves to change password
    if (context.userId !== id) {
      throw new ForbiddenException('Not authorized to change this password');
    }

    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const user = await tenantDb.user.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);

    // Update password
    await tenantDb.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async getUsersByRole(role: string, context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const users = await tenantDb.user.findMany({
      where: {
        organizationId: context.organizationId,
        role,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dealershipId: true,
        dealership: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  }

  async getUserStats(context: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(context.organizationId);

    const [
      totalUsers,
      activeUsers,
      usersByRole,
      usersByDealership,
    ] = await Promise.all([
      tenantDb.user.count({
        where: { organizationId: context.organizationId },
      }),
      tenantDb.user.count({
        where: {
          organizationId: context.organizationId,
          isActive: true,
        },
      }),
      tenantDb.user.groupBy({
        by: ['role'],
        where: {
          organizationId: context.organizationId,
          isActive: true,
        },
        _count: true,
      }),
      tenantDb.user.groupBy({
        by: ['dealershipId'],
        where: {
          organizationId: context.organizationId,
          isActive: true,
          dealershipId: { not: null },
        },
        _count: true,
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc: Record<string, any>, item) => {
        acc[item.role] = item._count;
        return acc;
      }, {}),
      usersByDealership: usersByDealership.length,
    };
  }
}