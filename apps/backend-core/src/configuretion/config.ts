import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app-config', () => ({
  port: Number(process.env.BACKEND_PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  defaultCompanySlug: process.env.DEFAULT_COMPANY_SLUG || 'default',
  cacheTtlSeconds: Number(process.env.CACHE_TTL) || 30,
  runMigrations: process.env.RUN_MIGRATIONS !== 'false',
}));

export const pgConfig = registerAs('pg-config', () => ({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'app',
  password: String(process.env.PG_PASSWORD) || 'app',
  database: process.env.PG_DATABASE || 'tma',
  max: Number(process.env.DB_POOL_MAX) || 10,
}));

export const redisConfig = registerAs('redis-config', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
}));

export const kafkaConfig = registerAs('kafka-config', () => ({
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092')
    .split(','),
  clientId: process.env.KAFKA_CLIENT_ID || 'backend-core',
  groupId: process.env.KAFKA_GROUP_ID || 'backend-core',
}));
