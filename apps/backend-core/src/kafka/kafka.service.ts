import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { kafkaConfig } from '../configuretion/config';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly enabled: boolean;

  constructor(
    @Inject(kafkaConfig.KEY) private readonly config: ConfigType<typeof kafkaConfig>,
  ) {
    this.enabled = Array.isArray(config.brokers) && config.brokers.length > 0;
  }

  async emit(topic: string, message: unknown): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        `Kafka disabled, skipped emit to ${topic}: ${JSON.stringify(message)}`,
      );
      return;
    }

    // Kafka client is not wired yet; log as a placeholder.
    this.logger.log(
      `Kafka emit ${topic} -> ${JSON.stringify(message)} (brokers: ${this.config.brokers.join(',')})`,
    );
  }

  async onModuleDestroy(): Promise<void> {
    // No client to close yet, placeholder for future Kafka integration.
  }
}
