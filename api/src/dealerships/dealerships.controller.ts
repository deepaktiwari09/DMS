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
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DealershipsService } from './dealerships.service';
import { CreateDealershipDto } from './dto/create-dealership.dto';
import { UpdateDealershipDto } from './dto/update-dealership.dto';
import { DealershipFilterDto } from './dto/dealership-filter.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('dealerships')
@UseGuards(AuthGuard('jwt'))
export class DealershipsController {
  constructor(private readonly dealershipsService: DealershipsService) {}

  @Post()
  create(
    @Body() createDealershipDto: CreateDealershipDto,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.create(
      req.user.organizationId,
      createDealershipDto,
    );
  }

  @Get()
  findAll(
    @Query() filters: DealershipFilterDto,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.findAll(req.user.organizationId, filters);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.findOne(
      req.user.organizationId,
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id/stats')
  getStats(
    @Param('id') id: string,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.getStats(req.user.organizationId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDealershipDto: UpdateDealershipDto,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.update(
      req.user.organizationId,
      id,
      updateDealershipDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: TenantContext },
  ) {
    return this.dealershipsService.remove(req.user.organizationId, id);
  }
}