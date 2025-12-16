import { NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseSchema } from '../../postgres/database.types';
import { RuntimeProjectsService } from './runtime-projects.service';
import { RuntimeProjectsRepository } from './runtime-projects.repository';
import { RedisService } from '../../redis/redis.service';

class InMemoryRedisService implements Partial<RedisService> {
  private readonly store = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    await Promise.resolve();
    const value = this.store.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Promise.resolve();
    this.store.set(key, JSON.stringify(value));
  }
}

class StubProjectsRepo extends RuntimeProjectsRepository {
  project: {
    id: string;
    company_id: string;
    slug: string;
    name: string;
    game_type: string;
    status: 'active' | 'draft' | 'paused';
  } | null = null;
  config: {
    config_json: Record<string, unknown>;
    version: number;
  } | null = null;
  calls = 0;

  async findActiveProjectBySlug(slug: string) {
    await Promise.resolve();
    this.calls += 1;
    if (this.project && this.project.slug === slug) {
      return this.project;
    }
    return null;
  }

  async findLatestPublishedConfig(projectId: string) {
    await Promise.resolve();
    if (this.project?.id === projectId) {
      return this.config;
    }
    return null;
  }

  async findActiveProjectById(id: string) {
    await Promise.resolve();
    if (this.project?.id === id) {
      return this.project;
    }
    return null;
  }
}

describe('RuntimeProjectsService', () => {
  it('caches project by slug after first fetch', async () => {
    const dummyDb = {} as unknown as Kysely<DatabaseSchema>;
    const repo = new StubProjectsRepo(dummyDb);
    repo.project = {
      id: 'p1',
      company_id: 'c1',
      slug: 'demo',
      name: 'Demo',
      game_type: 'clicker',
      status: 'active',
    };
    repo.config = {
      config_json: { type: 'clicker', rewardPerClick: 1 },
      version: 1,
    };
    const redis = new InMemoryRedisService();
    const service = new RuntimeProjectsService(
      repo,
      redis as unknown as RedisService,
      60,
    );

    await service.findBySlug('demo');
    await service.findBySlug('demo');

    expect(repo.calls).toBe(1);
  });

  it('throws when no published config', async () => {
    const dummyDb = {} as unknown as Kysely<DatabaseSchema>;
    const repo = new StubProjectsRepo(dummyDb);
    repo.project = {
      id: 'p1',
      company_id: 'c1',
      slug: 'demo',
      name: 'Demo',
      game_type: 'clicker',
      status: 'active',
    };
    repo.config = null;
    const redis = new InMemoryRedisService();
    const service = new RuntimeProjectsService(
      repo,
      redis as unknown as RedisService,
      60,
    );

    await expect(service.findBySlug('demo')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
