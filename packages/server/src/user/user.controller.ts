import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { AgentDtoCreate, UserDtoCreate } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
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

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async addAgent(
    @Body() agent: AgentDtoCreate,
    @Headers('Authorization') token: string,
  ) {
    const payload = this.extractPayload(token);
    const newAgent = await this.userService.addAgent(
      payload.sub,
      agent.first_name,
      agent.last_name,
      agent.email,
      agent.password,
      agent.role,
      agent.phone_number,
      agent.county,
    );

    return newAgent;
  }

  private extractPayload(token: string) {
    const [, originalToken] = token.split(' ');
    const payload = this.jwtService.verify(originalToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return payload;
  }
}
