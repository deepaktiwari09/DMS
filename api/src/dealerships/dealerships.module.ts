import { Module } from '@nestjs/common';
import { DealershipsService } from './dealerships.service';
import { DealershipsController } from './dealerships.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DealershipsController],
  providers: [DealershipsService],
  exports: [DealershipsService],
})
export class DealershipsModule {}