import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product.schema';
import { ProductController } from './product.controller';
import { UserService } from 'user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from 'user/user.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [UserService, JwtService, ConfigService],
})
export class ProductModule {}
