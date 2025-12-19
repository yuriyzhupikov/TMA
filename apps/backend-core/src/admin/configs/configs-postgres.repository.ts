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
export class ConfigsPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findProjectById(id: string): Promise<Selectable<ProjectTable> | null> {
    const row = await this.db
      .selectFrom('project')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return row ?? null;
  }

  async findLatest(
    projectId: string,
  ): Promise<Selectable<ProjectConfigTable> | null> {
    const row = await this.db
      .selectFrom('project_config')
      .selectAll()
      .where('project_id', '=', projectId)
      .orderBy('version', 'desc')
      .executeTakeFirst();

    return row ?? null;
  }

  async findByVersion(
    projectId: string,
    version: number,
  ): Promise<Selectable<ProjectConfigTable> | null> {
    const row = await this.db
      .selectFrom('project_config')
      .selectAll()
      .where('project_id', '=', projectId)
      .where('version', '=', version)
      .executeTakeFirst();

    return row ?? null;
  }

  async insertDraft(
    projectId: string,
    version: number,
    config: Record<string, unknown>,
  ): Promise<Selectable<ProjectConfigTable>> {
    const inserted = await this.db
      .insertInto('project_config')
      .values({
        project_id: projectId,
        version,
        status: 'draft',
        config_json: config,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return inserted;
  }

  async archivePublished(projectId: string): Promise<void> {
    await this.db
      .updateTable('project_config')
      .set({ status: 'archived' })
      .where('project_id', '=', projectId)
      .where('status', '=', 'published')
      .execute();
  }

  async publishVersion(
    projectId: string,
    version: number,
  ): Promise<Selectable<ProjectConfigTable>> {
    const published = await this.db
      .updateTable('project_config')
      .set({ status: 'published' })
      .where('project_id', '=', projectId)
      .where('version', '=', version)
      .returningAll()
      .executeTakeFirstOrThrow();

    return published;
  }

  async list(projectId: string): Promise<Selectable<ProjectConfigTable>[]> {
    return this.db
      .selectFrom('project_config')
      .selectAll()
      .where('project_id', '=', projectId)
      .orderBy('version', 'desc')
      .execute();
  }
}
