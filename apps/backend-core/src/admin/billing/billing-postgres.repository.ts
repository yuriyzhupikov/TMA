import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema } from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class BillingPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async countEventsSince(projectId: string, since: Date): Promise<number> {
    const res = await this.db
      .selectFrom('event_log')
      .select(({ fn }) => fn.countAll<number>().as('count'))
      .where('project_id', '=', projectId)
      .where('ts', '>=', since)
      .executeTakeFirst();

    return Number(res?.count ?? 0);
  }
}
