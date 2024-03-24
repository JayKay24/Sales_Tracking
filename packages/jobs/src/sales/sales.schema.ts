import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type SaleDocument = HydratedDocument<Sale>;

@Schema({ timestamps: true })
class Sale {
  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  agent: string;

  @Prop({ required: true })
  agentId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  agentEmail: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  commissionRate: string;
}

const SaleSchema = SchemaFactory.createForClass(Sale);

export { Sale, SaleDocument, SaleSchema };
