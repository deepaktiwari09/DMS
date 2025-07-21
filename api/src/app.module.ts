import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './common/middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DealershipsModule } from './dealerships/dealerships.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { ServiceAppointmentsModule } from './service-appointments/service-appointments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityFeedModule } from './activity-feed/activity-feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        if (!config.DATABASE_URL) {
          throw new Error('DATABASE_URL is required');
        }
        if (!config.JWT_SECRET) {
          throw new Error('JWT_SECRET is required');
        }
        return config;
      },
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    OrganizationsModule,
    DealershipsModule,
    UsersModule,
    CustomersModule,
    InventoryModule,
    SalesModule,
    ServiceAppointmentsModule,
    NotificationsModule,
    ActivityFeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
