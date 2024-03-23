import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductCategory } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async addProduct(name: string, category: ProductCategory, price: number) {
    const existingProduct = await this.productModel.findOne({ name });
    if (existingProduct) {
      throw new ConflictException('Product with that name already exists');
    }

    const newProduct = new this.productModel({
      name,
      category,
      price,
    });

    const prod = await newProduct.save();

    return {
      id: prod._id.toString(),
      name: prod.name,
      category: prod.category,
      price: prod.price,
    };
  }
}
