import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import { DatabaseSchema, ProjectTable } from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class ProjectsPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findAll(
    companyId?: string,
  ): Promise<
    Array<
      Selectable<
        Pick<
          ProjectTable,
          'id' | 'company_id' | 'slug' | 'name' | 'game_type' | 'status'
        >
      >
    >
  > {
    const query = this.db
      .selectFrom('project')
      .select(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .orderBy('created_at', 'desc');

    if (companyId) {
      return query.where('company_id', '=', companyId).execute();
    }

    return query.execute();
  }

  async findById(
    id: string,
  ): Promise<Selectable<
    Pick<
      ProjectTable,
      'id' | 'company_id' | 'slug' | 'name' | 'game_type' | 'status'
    >
  > | null> {
    const row = await this.db
      .selectFrom('project')
      .select(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .where('id', '=', id)
      .executeTakeFirst();

    return row ?? null;
  }

  async findSlug(companyId: string, slug: string): Promise<string | null> {
    const row = await this.db
      .selectFrom('project')
      .select(['id'])
      .where('company_id', '=', companyId)
      .where('slug', '=', slug)
      .executeTakeFirst();

    return row?.id ?? null;
  }

  async insert(project: {
    companyId: string;
    slug: string;
    name: string;
    gameType: string;
    status: 'draft' | 'active' | 'paused';
  }) {
    return this.db
      .insertInto('project')
      .values({
        company_id: project.companyId,
        slug: project.slug,
        name: project.name,
        game_type: project.gameType,
        status: project.status,
      })
      .returning(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .executeTakeFirstOrThrow();
  }

  async update(
    id: string,
    payload: Partial<Pick<ProjectTable, 'name' | 'status'>>,
  ) {
    return this.db
      .updateTable('project')
      .set(payload)
      .where('id', '=', id)
      .returning(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .executeTakeFirstOrThrow();
  }

  async findCompanyById(companyId: string): Promise<{ id: string } | null> {
    const row = await this.db
      .selectFrom('company')
      .select(['id'])
      .where('id', '=', companyId)
      .executeTakeFirst();

    return row ?? null;
  }
}
