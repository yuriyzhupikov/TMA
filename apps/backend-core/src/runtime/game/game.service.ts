import { BadRequestException, Injectable } from '@nestjs/common';
import { applyClickRule } from './rules/click-rule';
import {
  ClickerConfig,
  PlayerProgressState,
  RuntimeConfig,
  RuntimeEventPayload,
  RuntimeEventResult,
} from './types';

@Injectable()
export class GameService {
  handleEvent(
    config: RuntimeConfig,
    progress: PlayerProgressState,
    event: RuntimeEventPayload,
  ): RuntimeEventResult {
    if (event.eventType === 'CLICK') {
      const clickerConfig = config as ClickerConfig;
      return applyClickRule(progress, clickerConfig);
    }

    throw new BadRequestException(`Unsupported event type: ${event.eventType}`);
  }
}
