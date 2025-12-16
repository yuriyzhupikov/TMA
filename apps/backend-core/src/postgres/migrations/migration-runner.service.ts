import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, RawBuilder, sql } from 'kysely';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseSchema } from '../database.types';
import { PG_CLIENT } from '../../configuretion/constants';

@Injectable()
export class MigrationRunner implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunner.name);

  constructor(
    @Inject(PG_CLIENT) private readonly db: Kysely<DatabaseSchema>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const shouldRun = this.configService.get<boolean>(
      'app-config.runMigrations',
      true,
    );
    if (!shouldRun) {
      this.logger.log('Migrations are disabled (RUN_MIGRATIONS=false)');
      return;
    }

    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    const compiledDir = path.resolve(__dirname);
    const sourceDir = path.resolve(
      process.cwd(),
      'apps/backend-core/src/postgres/migrations',
    );
    const migrationsDir = fs.existsSync(compiledDir) ? compiledDir : sourceDir;

    if (!fs.existsSync(migrationsDir)) {
      this.logger.warn('No migrations directory found, skipping');
      return;
    }
    let directoryUsed = migrationsDir;
    let files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (
      !files.length &&
      migrationsDir !== sourceDir &&
      fs.existsSync(sourceDir)
    ) {
      directoryUsed = sourceDir;
      files = fs
        .readdirSync(sourceDir)
        .filter((file) => file.endsWith('.sql'))
        .sort();
    }

    if (!files.length) {
      this.logger.warn('No migration files detected, skipping');
      return;
    }

    for (const file of files) {
      const sqlText = fs.readFileSync(path.join(directoryUsed, file), 'utf-8');
      this.logger.log(`Applying migration ${file}`);
      const rawQuery: RawBuilder<unknown> = sql.raw(sqlText);
      await rawQuery.execute(this.db);
    }
  }
}
