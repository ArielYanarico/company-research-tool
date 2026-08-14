import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [DatabaseModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
