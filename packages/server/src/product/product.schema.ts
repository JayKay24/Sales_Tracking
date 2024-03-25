import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'user/user.schema';

enum ProductCategory {
  MEDICAL = 'medical',
  FOOD_BEVERAGES = 'food_beverages',
  CONSTRUCTION = 'construction',
  OFFICE_SUPPLIES = 'office_supplies',
  TECHNOLOGY = 'technology',
}

type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  category: ProductCategory;

  @Prop({ required: true })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  agent: User;
}

const ProductSchema = SchemaFactory.createForClass(Product);

export { ProductSchema, ProductDocument, ProductCategory, Product };
