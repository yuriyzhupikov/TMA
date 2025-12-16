import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { ProjectsModule } from './projects/projects.module';
import { ConfigsModule } from './configs/configs.module';
import { BillingModule } from './billing/billing.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TenantsModule,
    ProjectsModule,
    ConfigsModule,
    BillingModule,
    AnalyticsModule,
  ],
})
export class AdminModule {}
