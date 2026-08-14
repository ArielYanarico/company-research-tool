import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import jsonframe from 'jsonframe-cheerio';

interface LinkedinAboutInfo {
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  type?: string;
  founded?: string;
  specialties?: string;
}

interface LinkedinPerson {
  name: string;
  link: string | undefined;
}

interface LinkedinCompanyData extends LinkedinAboutInfo {
  people: LinkedinPerson[];
}

interface JsonFrameScrapable {
  scrape(frame: Record<string, string>): LinkedinAboutInfo;
}

@Injectable()
export class LinkedinProvider {
  async getCompany(companyName: string): Promise<LinkedinCompanyData> {
    const slug = encodeURIComponent(companyName.toLowerCase());
    const response = await fetch(
      `https://www.linkedin.com/company/${slug}?trk=public_jobs_topcard-org-name`,
    );
    const liveResponse = await fetch(
      `https://www.linkedin.com/company/${slug}/life?trk=nav_type_life`,
    );

    const html = await response.text();
    const liveHtml = await liveResponse.text();
    const frame = {
      website:
        'a.link-no-visited-state[data-tracking-control-name=about_website]',
      industry: 'div[data-test-id=about-us__industry] dd',
      companySize: 'div[data-test-id=about-us__size] dd',
      headquarters: 'div[data-test-id=about-us__headquarters] dd',
      type: 'div[data-test-id=about-us__type] dd',
      founded: 'div[data-test-id=about-us__foundedOn] dd',
      specialties: 'div[data-test-id=about-us__specialties] dd',
    };

    const $ = cheerio.load(html);
    const $live = cheerio.load(liveHtml);
    jsonframe($);

    const aboutInfo = ($('body') as unknown as JsonFrameScrapable).scrape(
      frame,
    );

    const people = $live('section[data-test-id=leaders-at] div ul > li')
      .map((_, li) => {
        const $li = $live(li);
        return {
          name: $li
            .find('h3.base-main-card__title')
            .text()
            .trim()
            .split('\n')[0],
          link: $li.find('a').attr('href'),
        };
      })
      .get();

    return { ...aboutInfo, people };
  }
}
