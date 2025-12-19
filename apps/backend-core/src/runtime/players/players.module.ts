import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersRepository } from './players.repository';

@Module({
  providers: [PlayersService, PlayersRepository],
  exports: [PlayersService],
})
export class PlayersModule {}
