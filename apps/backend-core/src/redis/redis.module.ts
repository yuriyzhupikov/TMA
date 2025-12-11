import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { redisConfig } from '../configuretion/config';
import { REDIS_CLIENT } from '../configuretion/constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [redisConfig.KEY],
      useFactory: (redisConfig_: ConfigType<typeof redisConfig>) =>
        new Redis({ ...redisConfig_ }),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
