import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class WikipediaProvider {
  async getCompany(companyName: string): Promise<unknown> {
    const title = encodeURIComponent(companyName);
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    );

    if (!response.ok) {
      throw new BadGatewayException(
        'Wikipedia company information is unavailable',
      );
    }

    const result = await response.json();

    if (!result || result.length === 0) {
      throw new BadRequestException(
        'Company not found in Wikipedia provider.',
      );
    }

    return result;
  }
}
