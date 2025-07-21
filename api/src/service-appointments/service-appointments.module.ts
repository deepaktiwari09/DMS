import { Module } from '@nestjs/common';
import { ServiceAppointmentsService } from './service-appointments.service';
import { ServiceAppointmentsController } from './service-appointments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ServiceAppointmentsController],
  providers: [ServiceAppointmentsService],
  exports: [ServiceAppointmentsService],
})
export class ServiceAppointmentsModule {}