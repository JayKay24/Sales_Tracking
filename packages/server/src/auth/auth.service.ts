import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'user/user.schema';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

export const saltOrRounds = 10;

export interface ValidatedUser {
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<ValidatedUser> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const validatedUser = { ...user.toObject() };
    delete validatedUser.password;

    return { email: validatedUser.email, id: validatedUser._id.toString() };
  }

  async login(user: ValidatedUser) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
