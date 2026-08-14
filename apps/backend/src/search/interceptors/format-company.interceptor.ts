import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  formatCompanyResponse,
  FormattedCompany,
  RawSearchResponse,
} from '../utils/format-company.util';

@Injectable()
export class FormatCompanyInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<FormattedCompany> {
    return next
      .handle()
      .pipe(
        map((response: RawSearchResponse) => formatCompanyResponse(response)),
      );
  }
}
