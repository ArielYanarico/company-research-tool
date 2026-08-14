import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true, index: true })
  query!: string;

  @Prop({ type: Object, required: true })
  response!: Record<string, unknown>;
}

export type CompanyDocument = HydratedDocument<Company>;

export const CompanySchema = SchemaFactory.createForClass(Company);
