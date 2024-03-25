import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductCategory } from 'product/product.schema';

export class ProductDtoCreate {
  @ApiProperty({
    name: 'name',
    example: 'computer',
    type: 'string',
    minLength: 5,
    maxLength: 20,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    name: 'category',
    type: 'string',
    example: ProductCategory.TECHNOLOGY,
  })
  @IsNotEmpty()
  @IsIn([
    ProductCategory.CONSTRUCTION,
    ProductCategory.FOOD_BEVERAGES,
    ProductCategory.MEDICAL,
    ProductCategory.OFFICE_SUPPLIES,
    ProductCategory.TECHNOLOGY,
  ])
  category: ProductCategory;

  @ApiProperty({
    name: 'price',
    example: 5000,
    minimum: 5000,
    maximum: 50000,
  })
  @IsNotEmpty()
  @Min(5000)
  @Max(50000)
  price: number;
}

export class ProductDtoUpdate {
  @ApiProperty({
    name: 'name',
    example: 'computer',
    type: 'string',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    name: 'category',
    type: 'string',
    example: ProductCategory.TECHNOLOGY,
  })
  @IsOptional()
  @IsIn([
    ProductCategory.CONSTRUCTION,
    ProductCategory.FOOD_BEVERAGES,
    ProductCategory.MEDICAL,
    ProductCategory.OFFICE_SUPPLIES,
    ProductCategory.TECHNOLOGY,
  ])
  category: ProductCategory;

  @ApiProperty({
    name: 'price',
    example: 5000,
    minimum: 5000,
    maximum: 50000,
  })
  @IsOptional()
  @Min(5000)
  @Max(50000)
  price: number;
}

export class ProductDtoResponse extends ProductDtoUpdate {
  @ApiProperty()
  id: string;
}

export class ProductDtoBuy {
  @ApiProperty({
    name: 'amount',
    minimum: 5000,
    maximum: 50000,
    type: 'number',
  })
  @IsNotEmpty()
  @Min(5000)
  @Max(50000)
  amount: number;

  @ApiProperty({ description: 'productId', type: 'string' })
  @IsNotEmpty()
  @IsString()
  id: string;
}
