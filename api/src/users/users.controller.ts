import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get()
  findAll(
    @Query() filterDto: UserFilterDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.findAll(filterDto, req.user);
  }

  @Get('stats')
  getUserStats(@Request() req: { user: TenantContext }) {
    return this.usersService.getUserStats(req.user);
  }

  @Get('by-role/:role')
  getUsersByRole(
    @Param('role') role: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.getUsersByRole(role, req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Patch(':id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.changePassword(id, changePasswordDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.usersService.remove(id, req.user);
  }
}