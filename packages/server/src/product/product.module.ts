import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product.schema';
import { ProductController } from './product.controller';
import { UserService } from 'user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [UserService, JwtService, ConfigService],
})
export class ProductModule {}
