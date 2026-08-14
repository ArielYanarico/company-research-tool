import { Injectable, Logger } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { ClearbitProvider } from '../clearbit-provider/clearbit-provider.service';
import { LinkedinProvider } from '../linkedin-provider/linkedin-provider.service';
import { WikipediaProvider } from '../wikipedia-provider/wikipedia-provider.service';
import { GetSearchDto } from './dto/get-search.dto';
import { resolveProviderRequests } from './utils/resolve-provider-requests.util';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly clearbitProvider: ClearbitProvider,
    private readonly wikipediaProvider: WikipediaProvider,
    private readonly linkedinProvider: LinkedinProvider,
  ) {}

  async create(getSearchDto: GetSearchDto): Promise<Record<string, unknown>> {
    const companyName = getSearchDto.companyName ?? '';
    const query = normalizeQuery(companyName);

    if (query) {
      const cached = await this.getCached(query);
      if (cached) return cached;
    }

    const providerRequests = [
      {
        name: 'clearbit',
        request: this.clearbitProvider.suggestCompanies(companyName),
      },
      {
        name: 'wikipedia',
        request: this.wikipediaProvider.getCompany(companyName),
      },
      {
        name: 'linkedin',
        request: this.linkedinProvider.getCompany(companyName),
      },
    ];

    const result = await resolveProviderRequests(providerRequests);

    if (query) {
      await this.saveResult(query, result);
    }

    return result;
  }

  private async getCached(
    query: string,
  ): Promise<Record<string, unknown> | undefined> {
    try {
      return (await this.companiesService.findCached(query)) ?? undefined;
    } catch (error) {
      this.logger.error(
        `Cache lookup failed for "${query}": ${getErrorMessage(error)}`,
      );
      return undefined;
    }
  }

  private async saveResult(
    query: string,
    result: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.companiesService.save(query, result);
    } catch (error) {
      this.logger.error(
        `Cache save failed for "${query}": ${getErrorMessage(error)}`,
      );
    }
  }
}

function normalizeQuery(companyName: string): string {
  return companyName.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
