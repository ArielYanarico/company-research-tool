import { Module } from '@nestjs/common';
import { ClearbitProviderModule } from '../clearbit-provider/clearbit-provider.module';
import { WikipediaProviderModule } from '../wikipedia-provider/wikipedia-provider.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [ClearbitProviderModule, WikipediaProviderModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
