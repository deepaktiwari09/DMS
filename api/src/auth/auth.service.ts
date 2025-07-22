import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TenantService, TenantContext } from '../database/tenant.service';
import { DatabaseService } from '../database/database.service';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: string;
    dealershipId?: string;
  };
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private tenantService: TenantService,
    private databaseService: DatabaseService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, organizationName, role = 'admin' } = registerDto;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create organization first
    const { organizationId } = await this.tenantService.createOrganization(
      organizationName,
      email
    );

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get tenant connection
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);

    // Create user in tenant database
    const user = await tenantDb.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        organizationId,
        isActive: true,
      },
    });

    const payload: TenantContext = {
      organizationId: user.organizationId,
      userId: user.id,
      role: user.role,
      permissions: user.permissions as string[] || [],
      subscriptionTier: 'starter',
      databaseName: this.tenantService.generateDatabaseName(organizationId),
      dealershipId: user.dealershipId || undefined,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        dealershipId: user.dealershipId || undefined,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user across all tenant databases
    // In a real implementation, you might have a user lookup table in master DB
    const user = await this.findUserByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    const tenantDb = await this.tenantService.getTenantConnection(user.organizationId);
    await tenantDb.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Get organization details
    const organization = await this.tenantService.getOrganizationById(user.organizationId);
    if (!organization) {
      throw new UnauthorizedException('Organization not found');
    }

    const payload: TenantContext = {
      organizationId: user.organizationId,
      userId: user.id,
      role: user.role,
      permissions: user.permissions as string[] || [],
      subscriptionTier: organization.tier as 'starter' | 'professional' | 'enterprise',
      databaseName: organization.databaseName,
      dealershipId: user.dealershipId || undefined,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
        dealershipId: user.dealershipId || undefined,
      },
    };
  }

  async validateUser(payload: TenantContext) {
    const tenantDb = await this.tenantService.getTenantConnection(payload.organizationId);
    const user = await tenantDb.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    
    const user = await this.findUserByEmail(email);
    if (!user) {
      // For security, always return success even if user doesn't exist
      return { message: 'If a user with this email exists, a password reset link has been sent.' };
    }

    // Generate reset token and expiration (1 hour from now)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to user record
    const tenantDb = await this.tenantService.getTenantConnection(user.organizationId);
    await tenantDb.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send email with reset link
    // In production, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'If a user with this email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Find user by reset token
    const user = await this.findUserByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // Check if token has expired
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Password reset token has expired');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    const tenantDb = await this.tenantService.getTenantConnection(user.organizationId);
    await tenantDb.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async changePassword(userId: string, organizationId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user
    const tenantDb = await this.tenantService.getTenantConnection(organizationId);
    const user = await tenantDb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await tenantDb.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }

  private async findUserByResetToken(token: string) {
    try {
      const organizations = await this.databaseService.organization.findMany({
        where: { isActive: true },
      });

      for (const org of organizations) {
        try {
          const tenantDb = await this.tenantService.getTenantConnection(org.id);
          const user = await tenantDb.user.findFirst({
            where: { passwordResetToken: token },
          });
          
          if (user) {
            return user;
          }
        } catch (error) {
          console.warn(`Failed to search user by reset token in org ${org.id}:`, error.message);
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      return null;
    }
  }

  private async findUserByEmail(email: string) {
    // This is a simplified implementation
    // In production, you might want to maintain a global user lookup table
    // or implement a more efficient user discovery mechanism
    
    try {
      // For now, we'll search in the master database for organizations
      // and then search in each tenant database
      // This is not optimal for large scale, but works for the MVP
      
      const organizations = await this.databaseService.organization.findMany({
        where: { isActive: true },
      });

      for (const org of organizations) {
        try {
          const tenantDb = await this.tenantService.getTenantConnection(org.id);
          const user = await tenantDb.user.findUnique({
            where: { email },
          });
          
          if (user) {
            return user;
          }
        } catch (error) {
          // Continue to next organization if this one fails
          console.warn(`Failed to search user in org ${org.id}:`, error.message);
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}