import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() creds: LoginDto) {
    try {
      const validUser = await this.authService.validateUser(
        creds.email,
        creds.password,
      );
      return this.authService.login(validUser);
    } catch (error) {
      throw new UnauthorizedException('Invalid login credentials');
    }
  }
}
