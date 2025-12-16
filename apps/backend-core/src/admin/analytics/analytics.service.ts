import { Injectable } from '@nestjs/common';
import { AnalyticsPostgresRepository } from './analytics-postgres.repository';

export interface AnalyticsOverview {
  totalEvents: number;
  uniquePlayers: number;
  lastEventAt: string | null;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly repo: AnalyticsPostgresRepository) {}

  async getOverview(projectId?: string): Promise<AnalyticsOverview> {
    const row = await this.repo.getOverview(projectId);

    return {
      totalEvents: Number(row?.total ?? 0),
      uniquePlayers: Number(row?.uniquePlayers ?? 0),
      lastEventAt: row?.lastTs ? new Date(row.lastTs).toISOString() : null,
    };
  }
}
