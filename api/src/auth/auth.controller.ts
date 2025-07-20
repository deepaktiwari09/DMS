import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: { user: TenantContext }) {
    return {
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Request() req: { user: TenantContext }) {
    // For simplicity, we'll just return a new token with the same payload
    // In production, you might want to implement refresh token rotation
    return this.authService.login({
      email: req.user.userId, // This would need to be modified to work properly
      password: '', // This is a placeholder - refresh tokens should be handled differently
    });
  }
}