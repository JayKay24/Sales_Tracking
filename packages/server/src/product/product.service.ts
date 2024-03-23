import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductCategory, ProductDocument } from './product.schema';
import { UserRole } from 'user/user.schema';
import { UserService } from 'user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private userService: UserService,
  ) {}

  async addProduct(
    email: string,
    name: string,
    category: ProductCategory,
    price: number,
  ) {
    const user = await this.userService.findUserByEmail(email);
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

  async getproductsByAgent(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.AGENT) {
      throw new ForbiddenException('Only agents can view their products');
    }
    const prods = await this.productModel
      .find({ agent: { $eq: user._id } })
      .exec();

    return prods.map((prod) => ({
      id: prod._id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
    }));
  }

  async assignProduct(email: string) {
    const user = await this.userService.findUserByEmail(email);
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

  async buyProduct(email: string, productId: string, amount: number) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.CUSTOMER) {
      throw new ForbiddenException('Only customers can buy products');
    }

    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (amount < product.price) {
      throw new BadRequestException('Payment is too low');
    }

    // Before delete, raise sale event

    await this.productModel.findByIdAndDelete(productId);

    return {
      change: amount - product.price,
    };
  }

  async updateProduct(
    email: string,
    productId: string,
    name = '',
    category = '',
    price = 0,
  ) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can upate product information');
    }

    const prod = await this.findProductById(productId);
    if (name) {
      prod.name = name;
    }

    if (category) {
      prod.category = category as ProductCategory;
    }

    if (price) {
      prod.price = price;
    }

    await prod.save();

    return {
      id: prod._id.toString(),
      name: prod.name,
      category: prod.category,
      price: prod.price,
    };
  }

  async deleteProduct(email: string, productId: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete a product');
    }

    await this.productModel.findByIdAndDelete(productId);
  }

  async findProductById(productId: string): Promise<ProductDocument> {
    try {
      const prod = await this.productModel.findById(productId).exec();
      if (!prod) {
        throw new NotFoundException();
      }

      return prod;
    } catch (error) {
      throw new NotFoundException(`product with id ${productId} not found`);
    }
  }
}
