import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductCategory } from 'product/product.schema';

export class ProductDtoCreate {
  @ApiProperty({
    description: 'name',
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
    description: 'price',
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
    description: 'name',
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
    description: 'price',
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
