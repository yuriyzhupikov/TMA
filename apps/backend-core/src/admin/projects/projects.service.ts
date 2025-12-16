import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsPostgresRepository } from './projects-postgres.repository';

export interface ProjectModel {
  id: string;
  companyId: string;
  slug: string;
  name: string;
  gameType: string;
  status: 'draft' | 'active' | 'paused';
}

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsPostgresRepository) {}

  async list(companyId?: string): Promise<ProjectModel[]> {
    const rows = await this.repo.findAll(companyId);

    return rows.map((row) => this.map(row));
  }

  async getById(id: string): Promise<ProjectModel> {
    const row = await this.repo.findById(id);

    if (!row) {
      throw new NotFoundException('Project not found');
    }

    return this.map(row);
  }

  async create(dto: CreateProjectDto): Promise<ProjectModel> {
    await this.ensureCompanyExists(dto.companyId);
    await this.ensureSlugUnique(dto.companyId, dto.slug);

    const inserted = await this.repo.insert({
      companyId: dto.companyId,
      slug: dto.slug,
      name: dto.name,
      gameType: dto.gameType,
      status: dto.status,
    });

    return this.map(inserted);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectModel> {
    const current = await this.repo.findById(id);

    if (!current) {
      throw new NotFoundException('Project not found');
    }

    const updated = await this.repo.update(id, {
      name: dto.name ?? current.name,
      status: dto.status ?? current.status,
    });

    return this.map(updated);
  }

  private async ensureCompanyExists(companyId: string): Promise<void> {
    const company = await this.repo.findCompanyById(companyId);

    if (!company) {
      throw new BadRequestException('Company not found');
    }
  }

  private async ensureSlugUnique(
    companyId: string,
    slug: string,
  ): Promise<void> {
    const conflict = await this.repo.findSlug(companyId, slug);

    if (conflict) {
      throw new BadRequestException('Slug already used for company');
    }
  }

  private map(row: {
    id: string;
    company_id: string;
    slug: string;
    name: string;
    game_type: string;
    status: 'draft' | 'active' | 'paused';
  }): ProjectModel {
    return {
      id: row.id,
      companyId: row.company_id,
      slug: row.slug,
      name: row.name,
      gameType: row.game_type,
      status: row.status,
    };
  }
}
