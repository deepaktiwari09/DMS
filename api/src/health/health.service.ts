import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  constructor(private databaseService: DatabaseService) {}

  async getHealthCheck() {
    const isDatabaseHealthy = await this.databaseService.healthCheck();
    
    return {
      status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        database: isDatabaseHealthy,
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}