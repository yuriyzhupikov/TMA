import { Injectable } from '@nestjs/common';
import { UpdateLimitsDto } from './dto/update-limits.dto';
import { BillingPostgresRepository } from './billing-postgres.repository';

export interface BillingOverview {
  projectId: string;
  monthlyLimit: number;
  eventsThisMonth: number;
}

@Injectable()
export class BillingService {
  private readonly limits = new Map<string, number>();

  constructor(private readonly repo: BillingPostgresRepository) {}

  async getOverview(projectId: string): Promise<BillingOverview> {
    const limit = this.limits.get(projectId) ?? 100000;
    const eventsThisMonth = await this.countEventsThisMonth(projectId);
    return { projectId, monthlyLimit: limit, eventsThisMonth };
  }

  async updateLimits(dto: UpdateLimitsDto): Promise<BillingOverview> {
    this.limits.set(dto.projectId, dto.monthlyLimit);
    return this.getOverview(dto.projectId);
  }

  private async countEventsThisMonth(projectId: string): Promise<number> {
    const now = new Date();
    const monthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    return this.repo.countEventsSince(projectId, monthStart);
  }
}
