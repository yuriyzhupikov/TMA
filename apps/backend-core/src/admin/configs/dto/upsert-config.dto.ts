import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpsertConfigDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsObject()
  config!: Record<string, unknown>;
}
