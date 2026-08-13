import { Injectable } from '@nestjs/common';
import { ClearbitProvider } from '../clearbit-provider/clearbit-provider.service';
import { WikipediaProvider } from '../wikipedia-provider/wikipedia-provider.service';
import { GetSearchDto } from './dto/get-search.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly clearbitProvider: ClearbitProvider,
    private readonly wikipediaProvider: WikipediaProvider,
  ) {}

  async create(getSearchDto: GetSearchDto): Promise<{
    clearbit: unknown;
    wikipedia: unknown;
  }> {
    const companyName = getSearchDto.companyName ?? '';
    const [clearbit, wikipedia] = await Promise.all([
      this.clearbitProvider.suggestCompanies(companyName),
      this.wikipediaProvider.getCompany(companyName),
    ]);

    return { clearbit, wikipedia };
  }
}
