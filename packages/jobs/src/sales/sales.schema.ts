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
  agent_id: string;

  @Prop({ required: true })
  customer_id: string;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  agent_email: string;

  @Prop({ required: true })
  customer_email: string;

  @Prop({ required: true })
  commission_rate: string;
}

const SaleSchema = SchemaFactory.createForClass(Sale);

export { Sale, SaleDocument, SaleSchema };
