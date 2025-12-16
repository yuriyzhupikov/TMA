import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { UpsertConfigDto } from './dto/upsert-config.dto';
import { PublishConfigDto } from './dto/publish-config.dto';

@Controller('admin/configs')
export class ConfigsController {
  constructor(private readonly configs: ConfigsService) {}

  @Get(':projectId')
  list(@Param('projectId') projectId: string) {
    return this.configs.list(projectId);
  }

  @Post('draft')
  createDraft(@Body() dto: UpsertConfigDto) {
    return this.configs.createDraft(dto);
  }

  @Post('publish')
  publish(@Body() dto: PublishConfigDto) {
    return this.configs.publish(dto);
  }
}
