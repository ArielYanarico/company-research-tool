import { Module } from '@nestjs/common';
import { ClearbitProvider } from './clearbit-provider.service';

@Module({
  providers: [ClearbitProvider],
  exports: [ClearbitProvider],
})
export class ClearbitProviderModule {}
