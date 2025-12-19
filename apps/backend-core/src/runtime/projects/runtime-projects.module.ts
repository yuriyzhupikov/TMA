import { Module } from '@nestjs/common';
import { RuntimeProjectsService } from './runtime-projects.service';
import { RedisModule } from '../../redis/redis.module';
import { RuntimeProjectsRepository } from './runtime-projects.repository';

@Module({
  imports: [RedisModule],
  providers: [RuntimeProjectsService, RuntimeProjectsRepository],
  exports: [RuntimeProjectsService],
})
export class RuntimeProjectsModule {}
