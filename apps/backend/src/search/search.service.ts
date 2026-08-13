import { Injectable } from '@nestjs/common';
import { GetSearchDto } from './dto/get-search.dto';

@Injectable()
export class SearchService {

  create(getSearchDto: GetSearchDto): string {
    return `This action adds a new search with companyName: ${getSearchDto.companyName ?? 'No company name provided'}`;
  }

}
