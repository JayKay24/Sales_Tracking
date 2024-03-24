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
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsIn([
    ProductCategory.CONSTRUCTION,
    ProductCategory.FOOD_BEVERAGES,
    ProductCategory.MEDICAL,
    ProductCategory.OFFICE_SUPPLIES,
    ProductCategory.TECHNOLOGY,
  ])
  category: ProductCategory;

  @IsNotEmpty()
  @Min(5000)
  @Max(50000)
  price: number;
}

export class ProductDtoUpdate {
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @IsIn([
    ProductCategory.CONSTRUCTION,
    ProductCategory.FOOD_BEVERAGES,
    ProductCategory.MEDICAL,
    ProductCategory.OFFICE_SUPPLIES,
    ProductCategory.TECHNOLOGY,
  ])
  category: ProductCategory;

  @IsOptional()
  @Min(5000)
  @Max(50000)
  price: number;
}

export class ProductDtoResponse extends ProductDtoCreate {}
