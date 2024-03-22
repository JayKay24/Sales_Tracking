import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(40)
  password: string;
}

export { LoginDto };
