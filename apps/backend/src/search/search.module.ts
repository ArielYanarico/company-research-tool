import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { ClearbitProviderModule } from '../clearbit-provider/clearbit-provider.module';
import { LinkedinProviderModule } from '../linkedin-provider/linkedin-provider.module';
import { WikipediaProviderModule } from '../wikipedia-provider/wikipedia-provider.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    CompaniesModule,
    ClearbitProviderModule,
    WikipediaProviderModule,
    LinkedinProviderModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
