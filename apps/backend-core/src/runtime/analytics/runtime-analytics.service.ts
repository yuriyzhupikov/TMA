import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../../kafka/kafka.service';
import { KAFKA_TOPICS } from '../../kafka/kafka-topics';
import { RuntimeEventDelta } from '../game/types';
import {
  RuntimeAnalyticsEventRecord,
  RuntimeAnalyticsRepository,
} from './runtime-analytics.repository';

export interface RuntimeAnalyticsEvent {
  companyId?: string | null;
  projectId?: string | null;
  playerId?: string | null;
  type: string;
  payload?: Record<string, unknown>;
  delta?: RuntimeEventDelta;
}

@Injectable()
export class RuntimeAnalyticsService {
  private readonly logger = new Logger(RuntimeAnalyticsService.name);

  constructor(
    public readonly repo: RuntimeAnalyticsRepository,
    public readonly kafka: KafkaService,
  ) {}

  async recordEvent(event: RuntimeAnalyticsEvent): Promise<void> {
    const normalized: RuntimeAnalyticsEventRecord = {
      companyId: event.companyId ?? null,
      projectId: event.projectId ?? null,
      playerId: event.playerId ?? null,
      type: event.type,
      payload: event.payload ?? {},
      delta: event.delta ?? { balanceDelta: 0, levelDelta: 0 },
    };

    await this.kafka.emit(KAFKA_TOPICS.runtimeEvents, {
      ...normalized,
      ts: new Date().toISOString(),
    });

    await this.repo.insertEvent(normalized);

    this.logger.debug(`Recorded runtime event ${normalized.type}`);
  }
}
