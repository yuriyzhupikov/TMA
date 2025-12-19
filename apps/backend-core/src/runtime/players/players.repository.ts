import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable, sql } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import {
  DatabaseSchema,
  PlayerProgressTable,
  PlayerTable,
} from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class PlayersRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findByProjectAndTelegram(
    projectId: string,
    telegramId: string,
  ): Promise<Selectable<PlayerTable> | null> {
    const player = await this.db
      .selectFrom('player')
      .selectAll()
      .where('project_id', '=', projectId)
      .where('telegram_id', '=', telegramId)
      .executeTakeFirst();

    return player ?? null;
  }

  async insertPlayer(
    projectId: string,
    telegramId: string,
  ): Promise<Selectable<PlayerTable>> {
    return this.db
      .insertInto('player')
      .values({
        project_id: projectId,
        telegram_id: telegramId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findById(id: string): Promise<Selectable<PlayerTable> | null> {
    const player = await this.db
      .selectFrom('player')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return player ?? null;
  }

  async findProgressForUpdate(
    playerId: string,
  ): Promise<Selectable<PlayerProgressTable> | null> {
    const progress = await this.db
      .selectFrom('player_progress')
      .selectAll()
      .where('player_id', '=', playerId)
      .forUpdate()
      .executeTakeFirst();

    return progress ?? null;
  }

  async insertProgress(
    playerId: string,
  ): Promise<Selectable<PlayerProgressTable>> {
    return this.db
      .insertInto('player_progress')
      .values({
        player_id: playerId,
        balance: 0,
        level: 1,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateProgress(
    playerId: string,
    balance: number,
    level: number,
  ): Promise<void> {
    await this.db
      .updateTable('player_progress')
      .set({
        balance,
        level,
        updated_at: sql`now()`,
      })
      .where('player_id', '=', playerId)
      .execute();
  }
}
