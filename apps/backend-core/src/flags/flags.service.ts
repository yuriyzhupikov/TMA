import { Injectable } from '@nestjs/common';

@Injectable()
export class FlagsService {
  isEnabled(flag: string): boolean {
    const envKey = `FLAG_${flag.toUpperCase()}`;
    return process.env[envKey] === '1' || process.env[envKey] === 'true';
  }

  getSnapshot(): Record<string, boolean> {
    return {
      redis: this.isEnabled('redis') ?? true,
      kafka: this.isEnabled('kafka') ?? true,
      clickhouse: this.isEnabled('clickhouse') ?? false,
    };
  }
}
