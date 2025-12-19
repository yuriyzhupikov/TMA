import { Module } from '@nestjs/common';
import { RuntimeService } from './runtime.service';
import { RuntimeController } from './runtime.controller';
import { RuntimeProjectsModule } from '../projects/runtime-projects.module';
import { PlayersModule } from '../players/players.module';
import { GameModule } from '../game/game.module';
import { RuntimeAnalyticsModule } from '../analytics/runtime-analytics.module';
import { RuntimeRepository } from './runtime.repository';

@Module({
  imports: [
    RuntimeProjectsModule,
    PlayersModule,
    GameModule,
    RuntimeAnalyticsModule,
  ],
  controllers: [RuntimeController],
  providers: [RuntimeService, RuntimeRepository],
})
export class RuntimeModule {}
