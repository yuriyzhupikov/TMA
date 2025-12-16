import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectConfigTable } from '../../postgres/database.types';
import type { Selectable } from 'kysely';
import { ConfigsPostgresRepository } from './configs-postgres.repository';
import { UpsertConfigDto } from './dto/upsert-config.dto';
import { PublishConfigDto } from './dto/publish-config.dto';

export interface ConfigVersionModel {
  projectId: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  config: Record<string, unknown>;
}

@Injectable()
export class ConfigsService {
  constructor(private readonly repo: ConfigsPostgresRepository) {}

  async createDraft(dto: UpsertConfigDto): Promise<ConfigVersionModel> {
    await this.ensureProjectExists(dto.projectId);
    const latest = await this.repo.findLatest(dto.projectId);
    const nextVersion = latest ? Number(latest.version) + 1 : 1;
    const inserted = await this.repo.insertDraft(
      dto.projectId,
      nextVersion,
      dto.config,
    );

    return this.map(inserted);
  }

  async publish(dto: PublishConfigDto): Promise<ConfigVersionModel> {
    const existing = await this.repo.findByVersion(dto.projectId, dto.version);
    if (!existing) {
      throw new NotFoundException('Config version not found');
    }
    if (existing.status === 'published') {
      return this.map(existing);
    }

    await this.repo.archivePublished(dto.projectId);
    const published = await this.repo.publishVersion(
      dto.projectId,
      dto.version,
    );

    return this.map(published);
  }

  async list(projectId: string): Promise<ConfigVersionModel[]> {
    const rows = await this.repo.list(projectId);
    return rows.map((row) => this.map(row));
  }

  private async ensureProjectExists(projectId: string): Promise<void> {
    const project = await this.repo.findProjectById(projectId);
    if (!project) {
      throw new BadRequestException('Project not found');
    }
  }

  private map(row: Selectable<ProjectConfigTable>): ConfigVersionModel {
    return {
      projectId: row.project_id,
      version: Number(row.version),
      status: row.status,
      config: row.config_json,
    };
  }
}
