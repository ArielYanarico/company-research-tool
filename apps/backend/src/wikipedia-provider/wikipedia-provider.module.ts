import { Module } from '@nestjs/common';
import { WikipediaProvider } from './wikipedia-provider.service';

@Module({
  providers: [WikipediaProvider],
  exports: [WikipediaProvider],
})
export class WikipediaProviderModule {}