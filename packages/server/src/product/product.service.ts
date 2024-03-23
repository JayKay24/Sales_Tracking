import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductCategory } from './product.schema';
import { User, UserRole } from 'user/user.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async addProduct(
    email: string,
    name: string,
    category: ProductCategory,
    price: number,
  ) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only admins can add products that agents will sell',
      );
    }
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

  async getProducts() {
    const prods = await this.productModel
      .find({ agent: { $ne: null } })
      .populate('agent', 'first_name', 'last_name', 'email')
      .exec();

    return prods.map((prod) => {
      return {
        id: prod._id.toString(),
        name: prod.name,
        category: prod.category,
        price: prod.price,
      };
    });
  }

  async assignProduct(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    const res = await this.productModel
      .updateMany({ agent: { $eq: null } }, { agent: user })
      .limit(2)
      .exec();

    if (!res.acknowledged) {
      throw new InternalServerErrorException(
        `Could not assign products to the agent of the email, ${email}`,
      );
    }

    const prods = await this.productModel
      .find({ agent: { $eq: user._id } })
      .populate('agent', 'first_name', 'last_name', 'email')
      .exec();

    return prods.map((prod) => {
      prod.id = prod._id.toString();
      delete prod._id;

      return prod;
    });
  }
}
