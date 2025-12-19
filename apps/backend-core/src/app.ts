import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  kafkaConfig,
  pgConfig,
  redisConfig,
} from './configuretion/config';
import { DatabaseModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { RuntimeModule } from './runtime/api/runtime.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { FlagsModule } from './flags/flags.module';
import { KafkaModule } from './kafka/kafka.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { AdminModule } from './admin/admin.module';
import { BotModule } from './runtime/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, pgConfig, redisConfig, kafkaConfig],
    }),
    DatabaseModule,
    RedisModule,
    PrometheusModule,
    MetricsModule,
    HealthModule,
    FlagsModule,
    KafkaModule,
    RuntimeModule,
    BotModule,
    AdminModule,
  ],
})
export class AppModule {}
