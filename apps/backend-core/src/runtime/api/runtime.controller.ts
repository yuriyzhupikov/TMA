import { Body, Controller, Post } from '@nestjs/common';
import { RuntimeService } from './runtime.service';
import { RuntimeInitDto } from './dto/runtime-init.dto';
import { RuntimeEventDto } from './dto/runtime-event.dto';

@Controller('runtime')
export class RuntimeController {
  constructor(private readonly runtimeService: RuntimeService) {}

  @Post('init')
  init(@Body() dto: RuntimeInitDto) {
    return this.runtimeService.init(dto);
  }

  @Post('event')
  handleEvent(@Body() dto: RuntimeEventDto) {
    return this.runtimeService.handleEvent(dto);
  }
}
