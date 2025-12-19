import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class PublishConfigDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsInt()
  @Min(1)
  version!: number;
}
