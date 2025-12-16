import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { BillingPostgresRepository } from './billing-postgres.repository';

@Module({
  controllers: [BillingController],
  providers: [BillingService, BillingPostgresRepository],
})
export class BillingModule {}
