import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class ClearbitProvider {
  async suggestCompanies(companyName: string): Promise<unknown> {
    const query = encodeURIComponent(companyName);
    const response = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`,
    );

    if (!response.ok) {
      throw new BadGatewayException('Clearbit company suggestions are unavailable');
    }

    return response.json();
  }
}