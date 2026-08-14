import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SearchService } from './search.service';
import { GetSearchDto } from './dto/get-search.dto';
import { FormatCompanyInterceptor } from './interceptors/format-company.interceptor';

@Controller('search')
@UseInterceptors(FormatCompanyInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  create(@Query() getSearchDto: GetSearchDto) {
    return this.searchService.create(getSearchDto);
  }
}
