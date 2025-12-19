import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsPostgresRepository } from './projects-postgres.repository';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsPostgresRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
