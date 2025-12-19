import { Injectable } from '@nestjs/common';
import {
  PlayerProgressTable,
  PlayerTable,
} from '../../postgres/database.types';
import { PlayersRepository } from './players.repository';
import type { Selectable } from 'kysely';

type PlayerRow = Selectable<PlayerTable>;
type PlayerProgressRow = Selectable<PlayerProgressTable>;

@Injectable()
export class PlayersService {
  constructor(private readonly repo: PlayersRepository) {}

  async findOrCreatePlayer(
    projectId: string,
    telegramId: string,
  ): Promise<PlayerRow> {
    const existing = await this.repo.findByProjectAndTelegram(
      projectId,
      telegramId,
    );

    if (existing) {
      return existing;
    }

    return this.repo.insertPlayer(projectId, telegramId);
  }

  async findOrCreateProgress(playerId: string): Promise<PlayerProgressRow> {
    const existing = await this.repo.findProgressForUpdate(playerId);

    if (existing) {
      return existing;
    }

    return this.repo.insertProgress(playerId);
  }

  async loadProgressForUpdate(
    playerId: string,
  ): Promise<PlayerProgressRow | null> {
    return this.repo.findProgressForUpdate(playerId);
  }

  async updateProgress(
    playerId: string,
    balance: number,
    level: number,
  ): Promise<void> {
    await this.repo.updateProgress(playerId, balance, level);
  }

  async getPlayerById(playerId: string): Promise<PlayerRow | null> {
    return this.repo.findById(playerId);
  }
}
