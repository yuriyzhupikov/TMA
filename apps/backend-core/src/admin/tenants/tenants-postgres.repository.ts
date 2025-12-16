import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema, CompanyTable } from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class TenantsPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findAll(): Promise<Selectable<CompanyTable>[]> {
    return this.db
      .selectFrom('company')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findById(id: string): Promise<Selectable<CompanyTable> | null> {
    const row = await this.db
      .selectFrom('company')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return row ?? null;
  }

  async findBySlug(slug: string): Promise<Selectable<CompanyTable> | null> {
    const row = await this.db
      .selectFrom('company')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();

    return row ?? null;
  }

  async insert(slug: string, name: string): Promise<Selectable<CompanyTable>> {
    return this.db
      .insertInto('company')
      .values({ slug, name })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(
    id: string,
    payload: Partial<Pick<CompanyTable, 'slug' | 'name'>>,
  ): Promise<Selectable<CompanyTable>> {
    return this.db
      .updateTable('company')
      .set(payload)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
