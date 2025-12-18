import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UserIdHeaderDto {
  @Expose({ name: 'x-user-id' })
  @IsDefined({ message: 'Missing x-user-id header' })
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
