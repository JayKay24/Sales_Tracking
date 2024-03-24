import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    name: 'first_name',
    example: 'bruce',
    type: 'string',
    minLength: 2,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  first_name: string;

  @ApiProperty({
    name: 'last_name',
    example: 'wayne',
    type: 'string',
    minLength: 2,
    maxLength: 40,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  last_name: string;

  @ApiProperty({
    name: 'email',
    example: 'bruce@example.com',
    type: 'string',
    minLength: 10,
    maxLength: 30,
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @ApiProperty({
    name: 'password',
    example: '123pass',
    minLength: 5,
    maxLength: 40,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  @IsAlphanumeric()
  password: string;

  @ApiProperty({
    name: 'role',
    example: UserRole.CUSTOMER,
  })
  @IsNotEmpty()
  @IsIn([UserRole.CUSTOMER])
  role: UserRole;

  @ApiProperty({
    name: 'phone_number',
    example: '+254700000000',
  })
  @IsNotEmpty()
  @IsPhoneNumber('KE')
  phone_number: string;

  @ApiProperty({
    name: 'county',
    example: 'Nairobi',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  county: string;
}

export class AgentDtoCreate extends UserDtoCreate {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn([UserRole.AGENT])
  role: UserRole;
}

export class UserDtoUpdate extends UserDtoCreate {
  @ApiProperty({
    name: 'role',
  })
  @IsEmpty()
  role: UserRole;

  @ApiProperty({
    name: 'first_name',
    example: 'bruce',
    maxLength: 40,
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  first_name: string;

  @ApiProperty({
    name: 'last_name',
    example: 'wayne',
    minLength: 2,
    maxLength: 40,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  last_name: string;

  @ApiProperty({
    name: 'email',
    example: 'bruce@example.com',
    minLength: 10,
    maxLength: 30,
  })
  @IsEmail()
  @IsOptional()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'bruce123',
    maxLength: 40,
    minLength: 5,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(40)
  @IsAlphanumeric()
  password: string;

  @ApiProperty({
    name: 'phone_number',
    example: '+254700000000',
  })
  @IsOptional()
  @IsPhoneNumber('KE')
  phone_number: string;

  @ApiProperty({
    name: 'county',
    example: 'Nairobi',
    minLength: 4,
    maxLength: 40,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  county: string;
}

export class UserResponse extends UserDtoCreate {
  @ApiProperty()
  id: string;
}
