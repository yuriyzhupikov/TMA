import { Global, Module } from '@nestjs/common';
import { FlagsService } from './flags.service';

@Global()
@Module({
  providers: [FlagsService],
  exports: [FlagsService],
})
export class FlagsModule {}
