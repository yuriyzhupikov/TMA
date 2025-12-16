import { Global, INestApplication, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  appConfig,
  kafkaConfig,
  pgConfig,
  redisConfig,
} from './configuretion/config';
import { PG_CLIENT, REDIS_CLIENT } from './configuretion/constants';
import { AdminModule } from './admin/admin.module';
import { RuntimeModule } from './runtime/api/runtime.module';
import { RedisService } from './redis/redis.service';
import { DatabaseSchema } from './postgres/database.types';
import { RuntimeProjectsService } from './runtime/projects/runtime-projects.service';
import { RuntimeProjectsRepository } from './runtime/projects/runtime-projects.repository';
import { TenantsService } from './admin/tenants/tenants.service';
import { UsersService } from './admin/users/users.service';
import { AuthService } from './admin/auth/auth.service';
import { ProjectsService } from './admin/projects/projects.service';
import { ConfigsService } from './admin/configs/configs.service';
import { RuntimeService } from './runtime/api/runtime.service';

type TableName = keyof DatabaseSchema;

class InMemoryStore {
  company: Array<{
    id: string;
    slug: string;
    name: string;
    created_at: Date;
  }> = [];

  user: Array<{
    id: string;
    email: string;
    password_hash: string;
    created_at: Date;
  }> = [];

  user_company: Array<{
    user_id: string;
    company_id: string;
    role: 'owner' | 'member';
  }> = [];

  project: Array<{
    id: string;
    company_id: string;
    slug: string;
    name: string;
    game_type: string;
    status: 'draft' | 'active' | 'paused';
    created_at: Date;
    updated_at: Date;
  }> = [];

  project_config: Array<{
    id: string;
    project_id: string;
    version: number;
    status: 'draft' | 'published' | 'archived';
    config_json: Record<string, unknown>;
    created_at: Date;
  }> = [];

  player: Array<{
    id: string;
    project_id: string;
    telegram_id: string;
    created_at: Date;
  }> = [];

  player_progress: Array<{
    player_id: string;
    balance: number;
    level: number;
    updated_at: Date;
  }> = [];

  event_log: Array<{
    id: string;
    ts: Date;
    company_id: string | null;
    project_id: string | null;
    player_id: string | null;
    type: string;
    payload_json: Record<string, unknown>;
    delta_json: Record<string, unknown>;
  }> = [];

  private next = 1;

  nextId(prefix: string): string {
    return `${prefix}-${this.next++}`;
  }
}

type Predicate<T> = (row: T) => boolean;

class SelectBuilder<T extends Record<string, unknown>> {
  private predicates: Array<Predicate<T>> = [];
  private order?: { column: keyof T; direction: 'asc' | 'desc' };
  private pickColumns?: (keyof T)[];

  constructor(
    private readonly rows: () => T[],
  ) {}

  selectAll(): this {
    this.pickColumns = undefined;
    return this;
  }

  select(columns: (keyof T)[] | unknown): this {
    if (Array.isArray(columns)) {
      this.pickColumns = columns as (keyof T)[];
    }
    return this;
  }

  where<K extends keyof T>(column: K, _op: '=', value: T[K]): this {
    this.predicates.push((row) => row[column] === value);
    return this;
  }

  forUpdate(): this {
    return this;
  }

  orderBy(column: keyof T, direction: 'asc' | 'desc'): this {
    this.order = { column, direction };
    return this;
  }

  async execute(): Promise<T[]> {
    let result = [...this.rows()];
    for (const predicate of this.predicates) {
      result = result.filter(predicate);
    }

    if (this.order) {
      const { column, direction } = this.order;
      result.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];
        if (aValue === bValue) return 0;
        return direction === 'asc'
          ? (aValue as number) > (bValue as number)
            ? 1
            : -1
          : (aValue as number) < (bValue as number)
            ? 1
            : -1;
      });
    }

    if (this.pickColumns && this.pickColumns.length > 0) {
      return result.map((row) => {
        const picked: Partial<T> = {};
        for (const column of this.pickColumns!) {
          picked[column] = row[column];
        }
        return picked as T;
      });
    }

    return result;
  }

  async executeTakeFirst(): Promise<T | undefined> {
    const [first] = await this.execute();
    return first;
  }

  async executeTakeFirstOrThrow(): Promise<T> {
    const first = await this.executeTakeFirst();
    if (!first) {
      throw new Error('Row not found');
    }
    return first;
  }
}

class InsertBuilder<T extends Record<string, unknown>> {
  private data: Partial<T> = {};
  private shouldReturnAll = false;

  constructor(
    private readonly table: TableName,
    private readonly store: InMemoryStore,
  ) {}

  values(values: Partial<T>): this {
    this.data = values;
    return this;
  }

  returningAll(): this {
    this.shouldReturnAll = true;
    return this;
  }

  returning(_columns: (keyof T)[]): this {
    this.shouldReturnAll = true;
    return this;
  }

  async execute(): Promise<unknown[]> {
    this.insertRow();
    return [];
  }

  async executeTakeFirstOrThrow(): Promise<T> {
    const row = this.insertRow();
    if (!row) {
      throw new Error('Insert failed');
    }
    return row;
  }

  private insertRow(): T {
    const row = this.buildRow();
    const rows = this.store[this.table] as unknown as T[];
    rows.push(row);
    return this.shouldReturnAll ? ({ ...row } as T) : row;
  }

  private buildRow(): T {
    const now = new Date();

    switch (this.table) {
      case 'company':
        return {
          id: this.store.nextId('cmp'),
          slug: String(this.data.slug),
          name: String(this.data.name),
          created_at: now,
        } as unknown as T;
      case 'user':
        return {
          id: this.store.nextId('usr'),
          email: String(this.data.email),
          password_hash: String(this.data.password_hash),
          created_at: now,
        } as unknown as T;
      case 'user_company':
        return {
          user_id: String(this.data.user_id),
          company_id: String(this.data.company_id),
          role: (this.data.role ?? 'member') as 'owner' | 'member',
        } as unknown as T;
      case 'project':
        return {
          id: this.store.nextId('prj'),
          company_id: String(this.data.company_id),
          slug: String(this.data.slug),
          name: String(this.data.name),
          game_type: String(this.data.game_type),
          status: (this.data.status ?? 'draft') as 'draft' | 'active' | 'paused',
          created_at: now,
          updated_at: now,
        } as unknown as T;
      case 'project_config':
        return {
          id: this.store.nextId('cfg'),
          project_id: String(this.data.project_id),
          version: Number(this.data.version),
          status: (this.data.status ?? 'draft') as
            | 'draft'
            | 'published'
            | 'archived',
          config_json: (this.data.config_json ??
            {}) as Record<string, unknown>,
          created_at: now,
        } as unknown as T;
      case 'player':
        return {
          id: this.store.nextId('ply'),
          project_id: String(this.data.project_id),
          telegram_id: String(this.data.telegram_id),
          created_at: now,
        } as unknown as T;
      case 'player_progress':
        return {
          player_id: String(this.data.player_id),
          balance: Number(this.data.balance ?? 0),
          level: Number(this.data.level ?? 1),
          updated_at: now,
        } as unknown as T;
      case 'event_log':
        return {
          id: this.store.nextId('ev'),
          ts: (this.data.ts as Date) ?? now,
          company_id: (this.data.company_id as string | null) ?? null,
          project_id: (this.data.project_id as string | null) ?? null,
          player_id: (this.data.player_id as string | null) ?? null,
          type: String(this.data.type),
          payload_json: (this.data.payload_json ??
            {}) as Record<string, unknown>,
          delta_json: (this.data.delta_json ??
            {}) as Record<string, unknown>,
        } as unknown as T;
      default:
        throw new Error(`Unsupported table: ${this.table}`);
    }
  }
}

class UpdateBuilder<T extends Record<string, unknown>> {
  private data: Partial<T> = {};
  private predicates: Array<Predicate<T>> = [];
  private shouldReturnAll = false;

  constructor(
    private readonly rows: () => T[],
  ) {}

  set(values: Partial<T>): this {
    this.data = values;
    return this;
  }

  where<K extends keyof T>(column: K, _op: '=', value: T[K]): this {
    this.predicates.push((row) => row[column] === value);
    return this;
  }

  returningAll(): this {
    this.shouldReturnAll = true;
    return this;
  }

  async execute(): Promise<void> {
    this.apply();
  }

  async executeTakeFirstOrThrow(): Promise<T> {
    const [first] = this.apply();
    if (!first) {
      throw new Error('No rows updated');
    }
    return first;
  }

  private apply(): T[] {
    const rows = this.rows();
    const matched: T[] = [];

    for (const row of rows) {
      const isMatch = this.predicates.every((predicate) => predicate(row));
      if (!isMatch) continue;

      Object.assign(row, this.data);
      matched.push({ ...(this.shouldReturnAll ? row : row) } as T);
    }

    return matched;
  }
}

class FakeDb {
  constructor(private readonly store: InMemoryStore) {}

  selectFrom<T extends Record<string, unknown>>(table: TableName) {
    return new SelectBuilder<T>(() => this.store[table] as unknown as T[]);
  }

  insertInto<T extends Record<string, unknown>>(table: TableName) {
    return new InsertBuilder<T>(table, this.store);
  }

  updateTable<T extends Record<string, unknown>>(table: TableName) {
    return new UpdateBuilder<T>(() => this.store[table] as unknown as T[]);
  }

  transaction() {
    return {
      execute: async <T>(
        cb: (trx: FakeDb) => Promise<T>,
      ): Promise<T> => cb(this),
    };
  }
}

class InMemoryRedisService {
  private readonly cache = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    const raw = this.cache.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    this.cache.set(key, payload);
    if (ttlSeconds && ttlSeconds > 0) {
      const timer = setTimeout(() => this.cache.delete(key), ttlSeconds * 1000);
      timer.unref?.();
    }
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

describe('backend-core e2e flow', () => {
  let app: INestApplication;
  let store: InMemoryStore;

  beforeAll(async () => {
    process.env.RUN_MIGRATIONS = 'false';
    store = new InMemoryStore();
    const fakeDb = new FakeDb(store);
    const redis = new InMemoryRedisService();

    @Global()
    @Module({
      providers: [{ provide: PG_CLIENT, useValue: fakeDb }],
      exports: [PG_CLIENT],
    })
    class TestingDbModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [
        TestingDbModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, pgConfig, redisConfig, kafkaConfig],
        }),
        AdminModule,
        RuntimeModule,
      ],
      providers: [
        { provide: REDIS_CLIENT, useValue: {} },
      ],
    })
      .overrideProvider(RedisService)
      .useValue(redis)
      .overrideProvider(RuntimeProjectsService)
      .useFactory({
        inject: [RuntimeProjectsRepository, RedisService],
        factory: (repo: RuntimeProjectsRepository, redisService: RedisService) =>
          new RuntimeProjectsService(repo, redisService, 5),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    jest.clearAllTimers();
  });

  it('runs admin + runtime happy path', async () => {
    const tenants = app.get(TenantsService);
    const users = app.get(UsersService);
    const auth = app.get(AuthService);
    const projects = app.get(ProjectsService);
    const configs = app.get(ConfigsService);
    const runtime = app.get(RuntimeService);

    const company = await tenants.create({ slug: 'acme', name: 'Acme Corp' });

    const user = await users.create({
      email: 'owner@example.com',
      password: 'secret1',
      companyId: company.id,
      role: 'owner',
    });

    const me = await auth.login({
      email: 'owner@example.com',
      password: 'secret1',
    });
    expect(me.email).toBe('owner@example.com');
    expect(me.id).toBe(user.id);

    const project = await projects.create({
      companyId: company.id,
      slug: 'clicker-app',
      name: 'Clicker App',
      gameType: 'clicker',
      status: 'active',
    });

    const draft = await configs.createDraft({
      projectId: project.id,
      config: { type: 'clicker', rewardPerClick: 2, level: { stepBalance: 5 } },
    });

    const publish = await configs.publish({
      projectId: project.id,
      version: draft.version,
    });
    expect(publish.status).toBe('published');

    const init = await runtime.init({
      projectSlug: 'clicker-app',
      telegramId: 'tg-123',
    });

    const playerId = init.player.id;
    expect(init.progress).toEqual({ balance: 0, level: 1 });
    expect(init.config.rewardPerClick).toBe(2);

    const event = await runtime.handleEvent({
      playerId,
      eventType: 'CLICK',
      payload: {},
    });

    expect(event.progress.balance).toBe(2);
    expect(event.delta.balanceDelta).toBe(2);
    expect(store.event_log.length).toBe(1);
  });
});
