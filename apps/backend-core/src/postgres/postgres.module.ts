import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool, PoolConfig } from 'pg';
import { DatabaseSchema } from './database.types';
import { PG_CLIENT } from '../configuretion/constants';
import { PgConfigValues, pgConfig } from '../configuretion/config';
import { MigrationRunner } from './migrations/migration-runner.service';
import '../types/pg.types';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_CLIENT,
      inject: [pgConfig.KEY],
      useFactory: (pgConfig_: PgConfigValues): Kysely<DatabaseSchema> => {
        const poolConfig: PoolConfig = {
          host: String(pgConfig_.host),
          port: Number(pgConfig_.port),
          user: String(pgConfig_.user),
          password:
            pgConfig_.password !== undefined
              ? String(pgConfig_.password)
              : undefined,
          database: String(pgConfig_.database),
          max: Number(pgConfig_.max),
        };

        // pg typings are provided via local declaration; constructor itself is untyped.

        const pool: Pool = new Pool(poolConfig);

        const dialect: PostgresDialect = new PostgresDialect({ pool });

        return new Kysely<DatabaseSchema>({
          dialect,
        });
      },
    },
    MigrationRunner,
  ],
  exports: [PG_CLIENT],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(PG_CLIENT) private readonly pgClient: Kysely<DatabaseSchema>,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.pgClient.destroy();
  }
}
