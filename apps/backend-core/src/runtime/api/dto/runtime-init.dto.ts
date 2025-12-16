import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RuntimeInitDto {
  @IsString()
  @IsNotEmpty()
  projectSlug!: string;

  @IsString()
  @IsOptional()
  telegramId?: string;

  @IsString()
  @IsOptional()
  initData?: string;
}
