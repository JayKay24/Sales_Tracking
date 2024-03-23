import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsOptional,
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
  @IsIn([UserRole.CUSTOMER])
  role: UserRole;

  @IsNotEmpty()
  @IsPhoneNumber('KE')
  phone_number: string;

  @IsString()
  @MinLength(4)
  @MaxLength(40)
  county: string;
}

export class AgentDtoCreate extends UserDtoCreate {
  @IsNotEmpty()
  @IsIn([UserRole.AGENT])
  role: UserRole;
}

export class UserDtoUpdate extends UserDtoCreate {
  @IsEmpty()
  role: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  first_name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  last_name: string;

  @IsEmail()
  @IsOptional()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(40)
  @IsAlphanumeric()
  password: string;

  @IsOptional()
  @IsPhoneNumber('KE')
  phone_number: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  county: string;
}
