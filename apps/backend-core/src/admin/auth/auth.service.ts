import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { UsersService, UserModel } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MeDto } from './dto/me.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(dto: LoginDto): Promise<MeDto> {
    const userRow = await this.usersService.findByEmail(dto.email);
    if (!userRow) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashed = this.hashPassword(dto.password);
    if (userRow.password_hash !== hashed) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.findUserById(String(userRow.id));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toMeDto(user);
  }

  async me(userId: string): Promise<MeDto> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toMeDto(user);
  }

  private async findUserById(userId: string): Promise<UserModel | undefined> {
    const users = await this.usersService.list();
    return users.find((u) => u.id === userId);
  }

  private toMeDto(user: UserModel): MeDto {
    return {
      id: user.id,
      email: user.email,
      companies: user.companies.map((c) => ({
        id: c.id,
        slug: c.id,
        role: c.role,
      })),
    };
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
