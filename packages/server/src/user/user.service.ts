import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserRole } from './user.schema';

import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'auth/auth.service';

@Injectable()
export class UserService {
  constructor(private readonly userModel: Model<User>) {}

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
}
