import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'product/product.schema';
import { ProducerQueuesService } from 'queues/queues.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private producerQueueService: ProducerQueuesService,
  ) {}

  async addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
    phoneNumber: string,
    county: string = '',
  ) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      this.logger.error('Failed to register user');
      throw new ConflictException('User with that email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = new this.userModel({
      first_name: firstName,
      last_name: lastName,
      role: role,
      phone_number: phoneNumber,
      password: hashedPassword,
      email,
      county,
    });
    const user = await newUser.save();
    return {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email,
      county: user.county,
    };
  }

  async addAgent(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
    phoneNumber: string,
    county: string,
  ) {
    let currentUser;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentUser = await this.findUser(userId);
    } catch (error) {
      this.logger.error('Failed to register an agent', error);
      throw new NotFoundException('Only admins allowed to add agents');
    }

    return this.addUser(
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      county,
    );
  }

  async updateUser(
    jwtPayload,
    userId,
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    phoneNumber = '',
    county = '',
  ) {
    try {
      const user = await this.findUser(userId);
      if (user.email !== jwtPayload.email) {
        throw new ForbiddenException();
      }

      if (firstName) {
        user.first_name = firstName;
      }

      if (lastName) {
        user.last_name = lastName;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        user.password = hashedPassword;
      }

      if (phoneNumber) {
        user.phone_number = phoneNumber;
      }

      if (county) {
        user.county = county;
      }

      await user.save();

      return {
        id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        county: user.county,
      };
    } catch (error) {
      this.logger.error('Failed to update user', error);
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You can only modify your own data');
      }
      throw new NotFoundException(`user with id ${userId} not found`);
    }
  }

  async assignProducts(email: string) {
    const user = await this.findUserByEmail(email);
    if (user.role !== UserRole.AGENT) {
      this.logger.error('Failed to assign product to user');
      throw new ForbiddenException(
        'Only agents can assign themselves to products to sell. 2 at a time.',
      );
    }
    const firstRes = await this.productModel
      .updateOne({ agent: { $eq: null } }, { agent: user })
      .exec();

    if (!firstRes.acknowledged) {
      this.logger.error('Failed to assign product to user');
      throw new InternalServerErrorException(
        `Could not assign products to the agent of the email, ${email}`,
      );
    }

    const secondRes = await this.productModel
      .updateOne({ agent: { $eq: null } }, { agent: user })
      .exec();

    if (!secondRes.acknowledged) {
      this.logger.error('Failed to assign product to user');
      throw new InternalServerErrorException(
        `Could not assign products to the agent of the email, ${email}`,
      );
    }

    const prods = await this.productModel
      .find({ agent: { $eq: user._id } })
      .populate('agent')
      .exec();

    return prods.map((prod) => {
      prod.id = prod._id.toString();
      delete prod._id;

      return prod;
    });
  }

  async notifyAgents(
    email: string,
    message: string,
    startDate: Date,
    endDate: Date,
  ) {
    if (startDate > endDate) {
      throw new BadRequestException('startDate must be earlier than endDate');
    }

    const user = await this.findUserByEmail(email);
    if (user.role !== UserRole.ADMIN) {
      this.logger.error('Failed to notify agents');
      throw new ForbiddenException(
        'Only admins can notify agents of sales records and commissions earned',
      );
    }

    const agents = await this.userModel.find({ role: UserRole.AGENT }).exec();
    const ids: string[] = [];
    agents.forEach((agent) => {
      ids.push(agent._id.toString());
    });

    await this.producerQueueService.notifyAgents(
      ids,
      message,
      startDate,
      endDate,
    );
  }

  async findUser(userId: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`user with id ${userId} not found`);
    }
  }

  async findUserByEmail(email): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        this.logger.error('Could not find the user with email', email);
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`user with email ${email} not found`);
    }
  }
}
