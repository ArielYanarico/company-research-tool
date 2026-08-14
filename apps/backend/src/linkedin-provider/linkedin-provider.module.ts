import { Module } from '@nestjs/common';
import { LinkedinProvider } from './linkedin-provider.service';

@Module({
  providers: [LinkedinProvider],
  exports: [LinkedinProvider],
})
export class LinkedinProviderModule {}
