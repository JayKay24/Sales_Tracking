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
import {
  ProductDtoCreate,
  ProductDtoResponse,
  ProductDtoUpdate,
} from './dto/product.dto';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { bearerDesc, exampleToken } from 'user/user.controller';

@ApiTags('products')
@Controller('api/v1/products')
export class ProductController {
  constructor(
    private jwtService: JwtService,
    private productService: ProductService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    description: 'Product with that name already exists',
    status: 409,
  })
  @ApiResponse({
    description: 'Only admins can add products that agents will sell',
    status: 403,
  })
  @ApiResponse({
    description: 'added product',
    type: ProductDtoResponse,
    status: 201,
  })
  @ApiOperation({
    description: 'admin can add a product',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
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

  @ApiResponse({
    description: 'Product with id {productId} not found',
    status: 404,
  })
  @ApiResponse({
    description: 'Only customers can buy products',
    status: 403,
  })
  @ApiResponse({
    description: 'cash change from purchase',
    status: 200,
  })
  @ApiOperation({
    description: 'customer can buy a product',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
  @Post('buy/:id')
  async buyProduct(
    @Param('id') productId: string,
    @Body() customerAmount: { amount: number },
    @Headers('Authorization') token: string,
  ) {
    const payload = this.extractPayload(token);
    return this.productService.buyProduct(
      payload.email,
      productId,
      customerAmount.amount,
    );
  }

  @ApiResponse({
    description: 'Only admins can upate product information',
    status: 403,
  })
  @ApiResponse({
    description: 'updated product',
    type: ProductDtoResponse,
    status: 200,
  })
  @ApiOperation({
    description: 'Update a products attributes',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
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

  @ApiResponse({
    description: 'products with agents assigned',
    type: [ProductDtoResponse],
    status: 200,
  })
  @Get()
  async getProducts() {
    const prods = await this.productService.getProducts();
    return prods;
  }

  @ApiResponse({
    description: 'user with email {email} not found',
    status: 404,
  })
  @ApiResponse({
    description: 'products assigned to currently signed in agent',
    type: [ProductDtoResponse],
    status: 200,
  })
  @ApiOperation({
    description: 'retrieve products assigned to currently signed in agent',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('agent')
  async getProductsByAgent(@Headers('Authorization') token: string) {
    const payload = this.extractPayload(token);
    const prods = await this.productService.getproductsByAgent(payload.email);

    return prods;
  }

  @ApiResponse({
    description: 'user with email {email} not found',
    status: 404,
  })
  @ApiResponse({
    description: 'product deleted',
    status: 204,
  })
  @ApiOperation({
    description: 'admin deletes a product',
  })
  @ApiHeader({
    name: 'description',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
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
