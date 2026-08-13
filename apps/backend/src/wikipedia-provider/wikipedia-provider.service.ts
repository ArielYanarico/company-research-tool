import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class WikipediaProvider {
  async getCompany(companyName: string): Promise<unknown> {
    const title = encodeURIComponent(companyName);
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/title/${title}`,
    );

    if (!response.ok) {
      throw new BadGatewayException('Wikipedia company information is unavailable');
    }

    return response.json();
  }
}