import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import {
  DatabaseSchema,
  ProjectConfigTable,
  ProjectTable,
} from '../../postgres/database.types';
import type { Selectable } from 'kysely';
import { ConfigsService } from './configs.service';
import { ConfigsPostgresRepository } from './configs-postgres.repository';
type TestDb = Kysely<DatabaseSchema>;
import { UpsertConfigDto } from './dto/upsert-config.dto';
import { PublishConfigDto } from './dto/publish-config.dto';

class InMemoryConfigsRepo extends ConfigsPostgresRepository {
  configs: Array<Selectable<ProjectConfigTable>> = [];
  projectExists = true;

  constructor() {
    const fakeDb = {} as unknown as TestDb;
    super(fakeDb);
  }

  async findProjectById(id: string): Promise<Selectable<ProjectTable> | null> {
    await Promise.resolve();
    if (!this.projectExists) return null;
    return {
      id,
      company_id: 'c1',
      slug: 'slug',
      name: 'name',
      game_type: 'clicker',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    } as unknown as Selectable<ProjectTable>;
  }

  async findLatest(
    projectId: string,
  ): Promise<Selectable<ProjectConfigTable> | null> {
    await Promise.resolve();
    const found = [...this.configs]
      .filter((c) => c.project_id === projectId)
      .sort((a, b) => b.version - a.version)[0];
    return (found as Selectable<ProjectConfigTable> | undefined) ?? null;
  }

  async findByVersion(
    projectId: string,
    version: number,
  ): Promise<Selectable<ProjectConfigTable> | null> {
    await Promise.resolve();
    return (
      this.configs.find(
        (c) => c.project_id === projectId && c.version === version,
      ) ?? null
    );
  }

  async insertDraft(
    projectId: string,
    version: number,
    config: Record<string, unknown>,
  ): Promise<Selectable<ProjectConfigTable>> {
    await Promise.resolve();
    const row = {
      id: `${projectId}-${version}`,
      project_id: projectId,
      version,
      status: 'draft' as const,
      config_json: config,
      created_at: new Date(),
    } as unknown as Selectable<ProjectConfigTable>;
    this.configs.push(row);
    return row;
  }

  async publishVersion(
    projectId: string,
    version: number,
  ): Promise<Selectable<ProjectConfigTable>> {
    await Promise.resolve();
    for (const cfg of this.configs) {
      if (cfg.project_id === projectId && cfg.status === 'published') {
        cfg.status = 'archived';
      }
    }
    const target = this.configs.find(
      (c) => c.project_id === projectId && c.version === version,
    );
    if (!target) {
      throw new Error('not found');
    }
    target.status = 'published';
    return target;
  }

  async archivePublished(projectId: string): Promise<void> {
    await Promise.resolve();
    for (const cfg of this.configs) {
      if (cfg.project_id === projectId && cfg.status === 'published') {
        cfg.status = 'archived';
      }
    }
  }
}

describe('ConfigsService', () => {
  it('creates draft with incremented version', async () => {
    const repo = new InMemoryConfigsRepo();
    const service = new ConfigsService(repo);

    const draft1 = await service.createDraft({
      projectId: 'p1',
      config: { a: 1 },
    } as UpsertConfigDto);
    const draft2 = await service.createDraft({
      projectId: 'p1',
      config: { a: 2 },
    } as UpsertConfigDto);

    expect(draft1.version).toBe(1);
    expect(draft2.version).toBe(2);
  });

  it('publishes draft and archives previous published', async () => {
    const repo = new InMemoryConfigsRepo();
    const service = new ConfigsService(repo);

    const draft = await service.createDraft({
      projectId: 'p1',
      config: { a: 1 },
    } as UpsertConfigDto);
    await service.publish({
      projectId: 'p1',
      version: draft.version,
    } as PublishConfigDto);

    expect(repo.configs.find((c) => c.version === draft.version)?.status).toBe(
      'published',
    );
  });

  it('throws for missing project', async () => {
    const repo = new InMemoryConfigsRepo();
    repo.projectExists = false;
    const service = new ConfigsService(repo);

    await expect(
      service.createDraft({
        projectId: 'missing',
        config: {},
      } as UpsertConfigDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when publishing unknown version', async () => {
    const repo = new InMemoryConfigsRepo();
    const service = new ConfigsService(repo);

    await expect(
      service.publish({ projectId: 'p1', version: 42 } as PublishConfigDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
