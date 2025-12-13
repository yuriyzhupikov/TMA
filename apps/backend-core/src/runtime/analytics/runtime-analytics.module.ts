import { Module } from '@nestjs/common';
import { RuntimeAnalyticsService } from './runtime-analytics.service';
import { KafkaModule } from '../../kafka/kafka.module';
import { RuntimeAnalyticsRepository } from './runtime-analytics.repository';

@Module({
  imports: [KafkaModule],
  providers: [RuntimeAnalyticsService, RuntimeAnalyticsRepository],
  exports: [RuntimeAnalyticsService],
})
export class RuntimeAnalyticsModule {}
