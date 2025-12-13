import { RuntimeEventType } from '../../game/types';

const SUPPORTED_EVENTS: RuntimeEventType[] = ['CLICK'];

export class RuntimeEventDto {
  static allowedProps = ['playerId', 'eventType', 'payload'];

  playerId!: string;
  eventType!: RuntimeEventType;
  payload?: Record<string, unknown>;

  static sanitize(value: any): RuntimeEventDto {
    const dto = new RuntimeEventDto();
    dto.playerId = String(value.playerId ?? '').trim();
    dto.eventType = String(value.eventType ?? '').toUpperCase() as RuntimeEventType;
    dto.payload = (value.payload as Record<string, unknown>) ?? {};
    return dto;
  }

  static validate(value: RuntimeEventDto): void {
    if (!value.playerId) {
      throw new Error('playerId is required');
    }
    if (!SUPPORTED_EVENTS.includes(value.eventType)) {
      throw new Error(
        `Unsupported eventType. Allowed: ${SUPPORTED_EVENTS.join(', ')}`,
      );
    }
  }
}
