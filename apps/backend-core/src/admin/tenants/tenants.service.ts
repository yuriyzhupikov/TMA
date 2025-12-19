import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsPostgresRepository } from './tenants-postgres.repository';

export interface TenantModel {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
}

@Injectable()
export class TenantsService {
  constructor(private readonly repo: TenantsPostgresRepository) {}

  async list(): Promise<TenantModel[]> {
    const rows = await this.repo.findAll();

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      createdAt: new Date(row.created_at),
    }));
  }

  async getById(id: string): Promise<TenantModel> {
    const row = await this.repo.findById(id);

    if (!row) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      createdAt: new Date(row.created_at),
    };
  }

  async create(dto: CreateTenantDto): Promise<TenantModel> {
    const existing = await this.repo.findBySlug(dto.slug);

    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    const inserted = await this.repo.insert(dto.slug, dto.name);

    return {
      id: inserted.id,
      slug: inserted.slug,
      name: inserted.name,
      createdAt: new Date(inserted.created_at),
    };
  }

  async update(id: string, dto: UpdateTenantDto): Promise<TenantModel> {
    const current = await this.repo.findById(id);

    if (!current) {
      throw new NotFoundException('Tenant not found');
    }

    if (dto.slug && dto.slug !== current.slug) {
      const slugClash = await this.repo.findBySlug(dto.slug);
      if (slugClash) {
        throw new BadRequestException('Slug already exists');
      }
    }

    const updated = await this.repo.update(id, {
      slug: dto.slug ?? current.slug,
      name: dto.name ?? current.name,
    });

    return {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      createdAt: new Date(updated.created_at),
    };
  }
}
