import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  gameType!: string;

  @IsString()
  @IsIn(['draft', 'active', 'paused'])
  status: 'draft' | 'active' | 'paused' = 'draft';
}
