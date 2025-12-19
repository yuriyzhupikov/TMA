import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  async processUpdate(payload: unknown): Promise<void> {
    this.logger.debug(`Received Telegram webhook: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }
}
