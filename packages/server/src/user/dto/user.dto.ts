import {
  IsAlphanumeric,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'user/user.schema';

export class UserDtoCreate {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  @IsAlphanumeric()
  password: string;

  @IsNotEmpty()
  @IsIn([UserRole.ADMIN, UserRole.AGENT, UserRole.CUSTOMER])
  role: UserRole;

  @IsNotEmpty()
  @IsPhoneNumber('KE')
  phone_number: string;

  @IsString()
  @MinLength(4)
  @MaxLength(40)
  county: string;
}
