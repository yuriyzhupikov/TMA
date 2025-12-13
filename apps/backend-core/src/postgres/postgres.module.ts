import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DatabaseSchema } from './database.types';
import { PG_CLIENT } from '../configuretion/constants';
import { pgConfig } from '../configuretion/config';
import { MigrationRunner } from './migrations/migration-runner.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_CLIENT,
      inject: [pgConfig.KEY],
      useFactory: (pgConfig_: ConfigType<typeof pgConfig>) =>
        new Kysely<DatabaseSchema>({
          dialect: new PostgresDialect({
            pool: new Pool({
              host: pgConfig_.host,
              port: pgConfig_.port,
              user: pgConfig_.user,
              password: pgConfig_.password,
              database: pgConfig_.database,
              max: pgConfig_.max,
            }),
          }),
        }),
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
