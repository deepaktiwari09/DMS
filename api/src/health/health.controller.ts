import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async healthCheck() {
    return this.healthService.getHealthCheck();
  }

  @Get('database')
  async databaseHealth() {
    const health = await this.healthService.getHealthCheck();
    return {
      status: health.services.database ? 'healthy' : 'unhealthy',
      timestamp: health.timestamp,
    };
  }
}