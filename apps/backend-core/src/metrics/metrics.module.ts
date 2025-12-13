import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '../prometheus/prometheus.module';

@Module({
  imports: [PrometheusModule],
  controllers: [MetricsController],
})
export class MetricsModule {}
