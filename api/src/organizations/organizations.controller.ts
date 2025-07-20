import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationsService } from './organizations.service';
import { TenantContext } from '../database/tenant.service';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/stats')
  async getStats(
    @Param('id') id: string,
    @Request() req: { user: TenantContext }
  ) {
    // Ensure user can only access their own organization's stats
    if (req.user.organizationId !== id) {
      throw new Error('Unauthorized access to organization stats');
    }
    
    return this.organizationsService.getOrganizationStats(id);
  }
}