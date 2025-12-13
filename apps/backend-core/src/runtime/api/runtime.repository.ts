import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema } from '../../postgres/database.types';

@Injectable()
export class RuntimeRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: Kysely<DatabaseSchema>) {}

  async runInTransaction<T>(
    cb: (trx: Kysely<DatabaseSchema>) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction().execute(cb);
  }
}
