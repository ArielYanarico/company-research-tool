import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from '../companies/companies.module';

const MONGO_URI = 'mongodb://localhost:27017/company-research';

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI), CompaniesModule],
})
export class DatabaseModule {}
