import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import type { Selectable } from 'kysely';
import { UserTable } from '../../postgres/database.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPostgresRepository } from './users-postgres.repository';

export interface UserModel {
  id: string;
  email: string;
  companies: Array<{
    id: string;
    role: 'owner' | 'member';
  }>;
}

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersPostgresRepository) {}

  async list(companyId?: string): Promise<UserModel[]> {
    const users = await this.repo.findAllUsers();
    const userCompanies = await this.repo.findUserCompanies();

    return users
      .map((user) => ({
        id: user.id,
        email: user.email,
        companies: userCompanies
          .filter((uc) => uc.user_id === user.id)
          .map((uc) => ({ id: uc.company_id, role: uc.role })),
      }))
      .filter((user) =>
        companyId
          ? user.companies.some((company) => company.id === companyId)
          : true,
      );
  }

  async findByEmail(email: string): Promise<Selectable<UserTable> | null> {
    return this.repo.findByEmail(email);
  }

  async create(dto: CreateUserDto): Promise<UserModel> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    await this.ensureCompany(dto.companyId);

    const inserted = await this.repo.insertUser(
      dto.email,
      this.hashPassword(dto.password),
    );

    await this.repo.insertUserCompany(inserted.id, dto.companyId, dto.role);

    return {
      id: inserted.id,
      email: inserted.email,
      companies: [{ id: dto.companyId, role: dto.role }],
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    const current = await this.repo.findById(id);

    if (!current) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== current.email) {
      const conflict = await this.repo.findByEmail(dto.email);
      if (conflict) {
        throw new BadRequestException('Email already used');
      }
    }

    await this.repo.updateUser(id, {
      email: dto.email ?? current.email,
      password_hash: dto.password
        ? this.hashPassword(dto.password)
        : current.password_hash,
    });

    if (dto.role) {
      await this.repo.updateUserRole(id, dto.role);
    }

    const companies = await this.repo.findCompaniesByUser(id);

    return {
      id: id,
      email: dto.email ?? current.email,
      companies: companies.map((c) => ({ id: c.company_id, role: c.role })),
    };
  }

  private async ensureCompany(companyId: string): Promise<void> {
    const company = await this.repo.findCompanyById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
