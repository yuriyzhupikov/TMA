import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema } from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

export interface AnalyticsRow {
  total: number;
  uniquePlayers: number;
  lastTs: Date | null;
}

@Injectable()
export class AnalyticsPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async getOverview(projectId?: string): Promise<AnalyticsRow | null> {
    const base = this.db
      .selectFrom('event_log')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`count(distinct player_id)`.as('uniquePlayers'),
        sql<Date | null>`max(ts)`.as('lastTs'),
      ]);

    const row = (
      projectId
        ? await base.where('project_id', '=', projectId).executeTakeFirst()
        : await base.executeTakeFirst()
    ) as AnalyticsRow | undefined;

    return row ?? null;
  }
}
