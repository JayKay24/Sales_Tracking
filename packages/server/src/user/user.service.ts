import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema';

import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole,
    phoneNumber: string,
    county: string = '',
  ) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
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
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You can only modify your own data');
      }
      throw new NotFoundException(`user with id ${userId} not found`);
    }
  }

  private async findUser(userId: string): Promise<UserDocument> {
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
}
