import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPostgresRepository } from './analytics-postgres.repository';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsPostgresRepository],
})
export class AnalyticsModule {}
