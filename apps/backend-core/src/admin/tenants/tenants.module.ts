import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TenantsPostgresRepository } from './tenants-postgres.repository';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, TenantsPostgresRepository],
  exports: [TenantsService],
})
export class TenantsModule {}
