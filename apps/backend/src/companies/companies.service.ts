import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './companies.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findCached(query: string): Promise<Record<string, unknown> | null> {
    const cached = await this.companyModel.findOne({ query }).lean().exec();

    return cached ? cached.response : null;
  }

  async save(query: string, response: Record<string, unknown>): Promise<void> {
    await this.companyModel
      .findOneAndUpdate({ query }, { $set: { response } }, { upsert: true })
      .exec();
  }
}
