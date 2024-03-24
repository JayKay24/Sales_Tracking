import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponse } from './dto/auth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    description: 'Invalid login credentials',
    status: 401,
  })
  @ApiResponse({
    description: 'access token for future requests',
    type: LoginResponse,
    status: 200,
  })
  @ApiOperation({
    description: 'login to get access token for future requests',
  })
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
