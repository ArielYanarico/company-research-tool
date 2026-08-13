import { Injectable } from '@nestjs/common';
import { ClearbitProvider } from '../clearbit-provider/clearbit-provider.service';
import { WikipediaProvider } from '../wikipedia-provider/wikipedia-provider.service';
import { GetSearchDto } from './dto/get-search.dto';
import { resolveProviderRequests } from './utils/resolve-provider-requests.util';

@Injectable()
export class SearchService {
  constructor(
    private readonly clearbitProvider: ClearbitProvider,
    private readonly wikipediaProvider: WikipediaProvider,
  ) {}

  async create(getSearchDto: GetSearchDto): Promise<Record<string, unknown>> {
    const companyName = getSearchDto.companyName ?? '';
    const providerRequests = [
      {
        name: 'clearbit',
        request: this.clearbitProvider.suggestCompanies(companyName),
      },
      {
        name: 'wikipedia',
        request: this.wikipediaProvider.getCompany(companyName),
      },
    ];

    return resolveProviderRequests(providerRequests);
  }
}
