import { Injectable } from '@nestjs/common';
import { ClearbitProvider } from '../clearbit-provider/clearbit-provider.service';
import { WikipediaProvider } from '../wikipedia-provider/wikipedia-provider.service';
import { GetSearchDto } from './dto/get-search.dto';
import { resolveProviderRequests } from './utils/resolve-provider-requests.util';
import { createOpenAI } from '@ai-sdk/openai';

import { chromium } from 'playwright'
import { Output } from 'ai'
import { z } from 'zod'
import LLMScraper from 'llm-scraper'

@Injectable()
export class SearchService {
  constructor(
    private readonly clearbitProvider: ClearbitProvider,
    private readonly wikipediaProvider: WikipediaProvider,
  ) { }

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


    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const llm = openrouter(process.env.OPENROUTER_MODEL ?? 'openrouter/free')
    const scraper = new LLMScraper(llm)

    const ContactSchema = z.object({
      address: z.string().describe("The physical address of the company"),
      phone: z.string().describe("The primary contact phone number"),
      email: z.string().email().describe("The contact email address"),
    });

    async function scrapeContactInfo(url) {
      // Connect to the browser served by the docker-compose "playwright" service
      const wsEndpoint = process.env.PLAYWRIGHT_WS_ENDPOINT ?? 'ws://localhost:3001/';
      const browser = await chromium.connect(wsEndpoint);
      const page = await browser.newPage();

      try {
        console.log(`Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        console.log(`Extracting data with OpenRouter...`);
        // The library automatically cleans the page HTML and passes it to Ollama
        const { data } = await scraper.run(page, Output.object({ schema: ContactSchema }));

        await browser.close();
        return data;

      } catch (error) {
        console.error(`Error scraping ${url}:`, (error as any));
        await browser.close();
        return null;
      }
    }

    const urls = ['https://bairesdev.com'];
    for (const url of urls) {
      const result = await scrapeContactInfo(url);
      console.log(`\nFinal Clean Data for ${url}:`, result);
    }

    return resolveProviderRequests(providerRequests);
  }
}
