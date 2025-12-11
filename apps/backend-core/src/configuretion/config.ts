import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  httpPort: Number(process.env.HTTP_PORT) || 3000,
  cacheTtlSeconds: Number(process.env.CACHE_TTL) || 30,
}));

export const pgConfig = registerAs('pg-config', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  user: process.env.DB_USER || 'user',
  password: String(process.env.DB_PASSWORD) || '1234',
  name: process.env.DB_NAME || 'user',
  max: Number(process.env.DB_POOL_MAX) || 10,
}));

export const redisConfig = registerAs('redis-config', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
}));
