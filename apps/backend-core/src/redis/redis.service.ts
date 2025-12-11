import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../configuretion/constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, serialized);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
