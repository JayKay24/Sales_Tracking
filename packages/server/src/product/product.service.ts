import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductCategory, ProductDocument } from './product.schema';
import { UserRole } from 'user/user.schema';
import { UserService } from 'user/user.service';
import { ProducerQueuesService, SaleEvent } from 'queues/queues.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private userService: UserService,
    private producerQueuesService: ProducerQueuesService,
  ) {}

  async addProduct(
    email: string,
    name: string,
    category: ProductCategory,
    price: number,
  ) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.ADMIN) {
      this.logger.error('Failed to add a product');
      throw new ForbiddenException(
        'Only admins can add products that agents will sell',
      );
    }
    const existingProduct = await this.productModel.findOne({ name });
    if (existingProduct) {
      this.logger.error('Failed to add a product');
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
      .populate('agent')
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
      this.logger.error(
        'Failed to fetch products by currently signed in agent',
      );
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

  async buyProduct(email: string, productId: string, amount: number) {
    const user = await this.userService.findUserByEmail(email);
    if (user.role !== UserRole.CUSTOMER) {
      this.logger.error(`Failed to buy product with user role ${user.role}`);
      throw new ForbiddenException('Only customers can buy products');
    }

    const session = await this.productModel.startSession();
    session.startTransaction();

    try {
      this.logger.log(`Start transaction ${session}`);
      const product = await this.productModel
        .findById(productId)
        .session(session)
        .exec();

      if (!product) {
        this.logger.error(`Failed to buy product with id ${productId}`);
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      if (amount < product.price) {
        this.logger.error(`Failed to buy product with amount ${amount}`);
        throw new BadRequestException('Payment is too low');
      }

      // Before delete, raise sale event
      const sale: SaleEvent = {
        price: 0,
        product: '',
        agent: '',
        agentId: '',
        customerId: '',
        customer: '',
        agentEmail: '',
        customerEmail: '',
      };

      const agent = await this.userService.findUser(product.agent.toString());

      sale.price = product.price;
      sale.product = product.name;
      sale.agent = `${agent.first_name} ${agent.last_name}`;
      sale.agentId = agent._id.toString();
      sale.customerId = user._id.toString();
      sale.customer = `${user.first_name} ${user.last_name}`;
      sale.agentEmail = agent.email;
      sale.customerEmail = user.email;

      await this.producerQueuesService.addToSalesQueue(sale);

      await this.productModel
        .findByIdAndDelete(productId)
        .session(session)
        .exec();

      await session.commitTransaction();

      this.logger.log(`Transaction committed successfully, ${session}`);

      return {
        change: amount - product.price,
      };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Transaction rolled back', error);
      throw error;
    } finally {
      session.endSession();
    }
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
      this.logger.error(
        `Failed to buy update product with user role ${user.role}`,
      );
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
      this.logger.error(`Failed to delete product with user role ${user.role}`);
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
