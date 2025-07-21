import { Module } from '@nestjs/common';
import { ActivityFeedService } from './activity-feed.service';
import { ActivityFeedController } from './activity-feed.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ActivityFeedController],
  providers: [ActivityFeedService],
  exports: [ActivityFeedService],
})
export class ActivityFeedModule {}