import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';
import { RuntimeProjectWithConfig, mapProjectWithConfig } from './mappers';
import { RuntimeProjectsRepository } from './runtime-projects.repository';
@Injectable()
export class RuntimeProjectsService {
  readonly cacheTtlSeconds: number;

  constructor(
    public readonly repo: RuntimeProjectsRepository,
    public readonly redisService: RedisService,
    cacheOrConfig: ConfigService | number,
  ) {
    this.cacheTtlSeconds =
      typeof cacheOrConfig === 'number'
        ? cacheOrConfig
        : cacheOrConfig.get<number>('app-config.cacheTtlSeconds', 30);
  }

  async findBySlug(slug: string): Promise<RuntimeProjectWithConfig> {
    const cacheKey = `runtime:project:slug:${slug}`;
    const cached =
      await this.redisService.get<RuntimeProjectWithConfig>(cacheKey);
    if (cached) {
      return cached;
    }

    const project = await this.repo.findActiveProjectBySlug(slug);

    if (!project) {
      throw new NotFoundException('Project not found or inactive');
    }

    const config = await this.repo.findLatestPublishedConfig(project.id);

    if (!config) {
      throw new NotFoundException('Published configuration not found');
    }

    const runtimeProject = mapProjectWithConfig(project, config);
    await this.redisService.set(cacheKey, runtimeProject, this.cacheTtlSeconds);

    return runtimeProject;
  }

  async findById(id: string): Promise<RuntimeProjectWithConfig> {
    const cacheKey = `runtime:project:id:${id}`;
    const cached =
      await this.redisService.get<RuntimeProjectWithConfig>(cacheKey);
    if (cached) {
      return cached;
    }

    const project = await this.repo.findActiveProjectById(id);

    if (!project) {
      throw new NotFoundException('Project not found or inactive');
    }

    const config = await this.repo.findLatestPublishedConfig(project.id);

    if (!config) {
      throw new NotFoundException('Published configuration not found');
    }

    const runtimeProject = mapProjectWithConfig(project, config);
    await this.redisService.set(cacheKey, runtimeProject, this.cacheTtlSeconds);

    return runtimeProject;
  }
}
