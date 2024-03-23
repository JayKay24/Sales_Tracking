import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'auth/jwt.guard';
import { ProductDtoCreate, ProductDtoUpdate } from './dto/product.dto';
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

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body() attributes: ProductDtoUpdate,
    @Headers('Authorization') token: string,
  ) {
    const payload = await this.extractPayload(token);
    const prod = await this.productService.updateProduct(
      payload.email,
      prodId,
      attributes.name,
      attributes.category,
      attributes.price,
    );

    return prod;
  }

  @Get()
  async getProducts() {
    const prods = await this.productService.getProducts();
    return prods;
  }

  @UseGuards(JwtAuthGuard)
  @Get('agent')
  async getProductsByAgent(@Headers('Authorization') token: string) {
    const payload = this.extractPayload(token);
    const prods = await this.productService.getproductsByAgent(payload.email);

    return prods;
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id') prodId: string,
    @Headers('Authorization') token: string,
  ) {
    const payload = await this.extractPayload(token);
    await this.productService.deleteProduct(payload.email, prodId);
    return null;
  }

  private extractPayload(token: string) {
    const [, originalToken] = token.split(' ');
    const payload = this.jwtService.verify(originalToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return payload;
  }
}
