import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateLimitsDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsInt()
  @IsPositive()
  monthlyLimit!: number;
}
