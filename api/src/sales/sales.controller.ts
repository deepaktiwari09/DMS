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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesFilterDto } from './dto/sales-filter.dto';
import { UpdateSaleStageDto } from './dto/update-sale-stage.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('sales')
@UseGuards(AuthGuard('jwt'))
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(
    @Body() createSaleDto: CreateSaleDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.create(createSaleDto, req.user);
  }

  @Get()
  findAll(
    @Query() filterDto: SalesFilterDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.findAll(filterDto, req.user);
  }

  @Get('stats')
  getSalesStats(
    @Request() req: { user: TenantContext },
    @Query('dealershipId') dealershipId?: string
  ) {
    return this.salesService.getSalesStats(req.user, dealershipId);
  }

  @Get('pipeline')
  getPipeline(
    @Request() req: { user: TenantContext },
    @Query('dealershipId') dealershipId?: string
  ) {
    return this.salesService.getPipeline(req.user, dealershipId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.update(id, updateSaleDto, req.user);
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateSaleStageDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.updateStage(id, updateStageDto, req.user);
  }

  @Patch(':id/assign/:salesPersonId')
  assignSalesPerson(
    @Param('id') id: string,
    @Param('salesPersonId') salesPersonId: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.assignSalesPerson(id, salesPersonId, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.salesService.remove(id, req.user);
  }
}