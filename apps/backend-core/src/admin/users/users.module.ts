import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersPostgresRepository } from './users-postgres.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersPostgresRepository],
  exports: [UsersService],
})
export class UsersModule {}
