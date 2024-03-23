import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'auth/jwt.guard';
import { ProductDtoCreate } from './dto/product.dto';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/products')
export class ProductController {
  constructor(
    private jwtService: JwtService,
    private productService: ProductService,
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addProduct(
    @Body() product: ProductDtoCreate,
    @Headers('Authorization') token: string,
  ) {
    const payload = this.extractPayload(token);
    const newProduct = await this.productService.addProduct(
      payload.email,
      product.name,
      product.category,
      product.price,
    );

    return newProduct;
  }

  private extractPayload(token: string) {
    const [, originalToken] = token.split(' ');
    const payload = this.jwtService.verify(originalToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return payload;
  }
}
