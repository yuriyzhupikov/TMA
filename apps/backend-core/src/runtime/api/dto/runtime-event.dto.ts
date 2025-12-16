import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { RuntimeEventType } from '../../game/types';

export class RuntimeEventDto {
  @IsString()
  playerId!: string;

  @IsIn(['CLICK'])
  eventType!: RuntimeEventType;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
