import { Injectable } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

export type MetricCounter<T extends string> = Counter<T>;

@Injectable()
export class PrometheusService {
  private readonly registry = new Registry();

  constructor() {
    collectDefaultMetrics({ register: this.registry });
  }

  createCounter<T extends string>(
    name: string,
    help: string,
    labelNames: T[],
  ): MetricCounter<T> {
    return new Counter({
      name,
      help,
      labelNames,
      registers: [this.registry],
    });
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
