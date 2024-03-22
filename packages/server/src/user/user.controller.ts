import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserDtoCreate } from './dto/user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post()
  async addUser(@Body() user: UserDtoCreate) {
    const newUser = await this.userService.addUser(
      user.first_name,
      user.last_name,
      user.email,
      user.password,
      user.role,
      user.phone_number,
      user.county,
    );
    return newUser;
  }
}
