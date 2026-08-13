import {
  Controller,
  Body,
  Get,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { GetSearchDto } from './dto/get-search.dto';


@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  create(@Body() getSearchDto: GetSearchDto) {
    return this.searchService.create({...getSearchDto});
  }
}