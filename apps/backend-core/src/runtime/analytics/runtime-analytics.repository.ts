import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema } from '../../postgres/database.types';
import { RuntimeEventDelta } from '../game/types';

type DbClient = Kysely<DatabaseSchema>;

export interface RuntimeAnalyticsEventRecord {
  companyId: string | null;
  projectId: string | null;
  playerId: string | null;
  type: string;
  payload: Record<string, unknown>;
  delta: RuntimeEventDelta;
}

@Injectable()
export class RuntimeAnalyticsRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async insertEvent(
    event: RuntimeAnalyticsEventRecord,
  ): Promise<void> {
    await this.db
      .insertInto('event_log')
      .values({
        company_id: event.companyId,
        project_id: event.projectId,
        player_id: event.playerId,
        type: event.type,
        payload_json: event.payload,
        delta_json: event.delta,
        ts: sql`now()`,
      })
      .execute();
  }
}
