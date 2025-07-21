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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerSearchDto } from './dto/customer-search.dto';
import { TransferCustomerDto } from './dto/transfer-customer.dto';
import { TenantContext } from '../database/tenant.service';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.create(createCustomerDto, req.user);
  }

  @Get()
  findAll(
    @Query() searchDto: CustomerSearchDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.findAll(searchDto, req.user);
  }

  @Get('stats')
  getCustomerStats(@Request() req: { user: TenantContext }) {
    return this.customersService.getCustomerStats(req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.update(id, updateCustomerDto, req.user);
  }

  @Patch(':id/transfer')
  transferCustomer(
    @Param('id') id: string,
    @Body() transferDto: TransferCustomerDto,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.transferCustomer(id, transferDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    return this.customersService.remove(id, req.user);
  }
}