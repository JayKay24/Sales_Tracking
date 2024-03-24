import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class LoginDto {
  @ApiProperty({
    description: 'email of registered user',
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
    description: 'password of registered user',
    example: 'bruce123',
    type: 'string',
    minLength: 5,
    maxLength: 40,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  password: string;
}

class LoginResponse {
  @ApiProperty()
  access_token: string;
}

export { LoginDto, LoginResponse };
