import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { ConfigsPostgresRepository } from './configs-postgres.repository';

@Module({
  controllers: [ConfigsController],
  providers: [ConfigsService, ConfigsPostgresRepository],
  exports: [ConfigsService],
})
export class ConfigsModule {}
