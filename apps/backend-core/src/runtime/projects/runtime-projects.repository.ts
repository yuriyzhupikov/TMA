import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import {
  DatabaseSchema,
  ProjectConfigTable,
  ProjectTable,
} from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class RuntimeProjectsRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findActiveProjectBySlug(
    slug: string,
  ): Promise<Selectable<
    Pick<
      ProjectTable,
      'id' | 'company_id' | 'slug' | 'name' | 'game_type' | 'status'
    >
  > | null> {
    const project = await this.db
      .selectFrom('project')
      .select(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .where('slug', '=', slug)
      .where('status', '=', 'active')
      .executeTakeFirst();

    return project ?? null;
  }

  async findActiveProjectById(
    id: string,
  ): Promise<Selectable<
    Pick<
      ProjectTable,
      'id' | 'company_id' | 'slug' | 'name' | 'game_type' | 'status'
    >
  > | null> {
    const project = await this.db
      .selectFrom('project')
      .select(['id', 'company_id', 'slug', 'name', 'game_type', 'status'])
      .where('id', '=', id)
      .where('status', '=', 'active')
      .executeTakeFirst();

    return project ?? null;
  }

  async findLatestPublishedConfig(
    projectId: string,
  ): Promise<Selectable<
    Pick<ProjectConfigTable, 'config_json' | 'version'>
  > | null> {
    const config = await this.db
      .selectFrom('project_config')
      .select(['config_json', 'version'])
      .where('project_id', '=', projectId)
      .where('status', '=', 'published')
      .orderBy('version', 'desc')
      .executeTakeFirst();

    return config ?? null;
  }
}
