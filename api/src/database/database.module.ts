import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TenantService } from './tenant.service';

@Global()
@Module({
  providers: [DatabaseService, TenantService],
  exports: [DatabaseService, TenantService],
})
export class DatabaseModule {}