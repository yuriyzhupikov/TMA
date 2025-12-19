import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsIn(['draft', 'active', 'paused'])
  @IsOptional()
  status?: 'draft' | 'active' | 'paused';
}
