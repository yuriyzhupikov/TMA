import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('telegram')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  async handleWebhook(@Body() payload: unknown) {
    await this.botService.processUpdate(payload);
    return { ok: true };
  }
}
