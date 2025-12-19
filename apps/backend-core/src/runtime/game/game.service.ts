import { BadRequestException, Injectable } from '@nestjs/common';
import { applyClickRule } from './rules/click-rule';
import {
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
      return applyClickRule(progress, config);
    }

    throw new BadRequestException('Unsupported event type');
  }
}
