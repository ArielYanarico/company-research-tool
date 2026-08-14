import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import jsonframe from 'jsonframe-cheerio';

@Injectable()
export class LinkedinProvider {
  async getCompany(companyName: string): Promise<string> {
    const slug = encodeURIComponent(companyName.toLowerCase());
    const response = await fetch(
      `https://www.linkedin.com/company/${slug}?trk=public_jobs_topcard-org-name`,
    );
    const liveResponse = await fetch(
      `https://www.linkedin.com/company/${slug}/life?trk=nav_type_life`
    );

    const html = await response.text();
    const liveHtml = await liveResponse.text();
    const frame = {
      website: 'a.link-no-visited-state[data-tracking-control-name=about_website]',
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

    const data = ($('body') as any).scrape(frame);

    const people = $live('section[data-test-id=leaders-at] div ul > li').map((_, li) => {
      const $li = $live(li);

      console.log('li:', $li.find('a').attr('href'));
      return {
        name: $li.find('h3.base-main-card__title').text().trim().split('\n')[0],
        link: $li.find('a').attr('href'),
      };
    }).get();

    data.people = people;

    return data;
  }
}
