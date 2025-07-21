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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { CreateInventoryViewDto } from './dto/create-inventory-view.dto';
import { UpdateInventoryViewDto } from './dto/update-inventory-view.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(
    @Body() createInventoryDto: CreateInventoryDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.create(createInventoryDto, req.user);
  }

  @Get()
  findAll(
    @Query() filterDto: InventoryFilterDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.findAll(filterDto, req.user);
  }

  @Get('stats')
  getInventoryStats(
    @Request() req: { user: TenantContext },
    @Query('dealershipId') dealershipId?: string
  ) {
    return this.inventoryService.getInventoryStats(req.user, dealershipId);
  }

  @Get('low-stock')
  getLowStockItems(
    @Request() req: { user: TenantContext },
    @Query('dealershipId') dealershipId?: string
  ) {
    return this.inventoryService.getLowStockItems(req.user, dealershipId);
  }

  // Custom Views Endpoints
  @Get('views')
  findAllViews(@Request() req: { user: TenantContext }) {
    return this.inventoryService.findAllViews(req.user);
  }

  @Post('views')
  createView(
    @Body() createViewDto: CreateInventoryViewDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.createView(createViewDto, req.user);
  }

  @Get('views/:id')
  findOneView(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.findOneView(id, req.user);
  }

  @Put('views/:id')
  updateView(
    @Param('id') id: string,
    @Body() updateViewDto: UpdateInventoryViewDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.updateView(id, updateViewDto, req.user);
  }

  @Delete('views/:id')
  removeView(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.removeView(id, req.user);
  }

  @Get('views/:id/apply')
  applyView(
    @Param('id') id: string,
    @Query() additionalFilters: InventoryFilterDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.applyView(id, req.user, additionalFilters);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.update(id, updateInventoryDto, req.user);
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.updateStock(id, updateStockDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.inventoryService.remove(id, req.user);
  }
}