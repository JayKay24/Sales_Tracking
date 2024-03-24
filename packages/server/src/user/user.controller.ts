import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import {
  AgentDtoCreate,
  UserDtoCreate,
  UserDtoUpdate,
  UserResponse,
} from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDtoResponse } from 'product/dto/product.dto';

export const exampleToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9saXZlckB0ZXN0LmNvbSIsInN1YiI6IjY0NTI0NzMxMGRlNTFiNTEwYmVlMzFjZSIsImlhdCI6MTY4MzExMzg0OCwiZXhwIjoxNjgzMjAwMjQ4fQ.T1ztqXzIARMxBIcTdGfXktT7mKCPx5CjuweNnMm4puE';
export const bearerDesc = 'Bearer token signed with jwt';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    description: 'The newly added user',
    type: UserResponse,
    status: 201,
  })
  @ApiResponse({
    description: 'User with that email already exists',
    status: 409,
  })
  @ApiOperation({
    description: 'Register a new user',
  })
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

  @ApiResponse({
    description: 'Only admins allowed to add agents',
    status: 404,
  })
  @ApiResponse({
    description: 'Agent registered',
    type: UserResponse,
    status: 201,
  })
  @ApiOperation({
    description: 'Admin registers an agent',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post('admins')
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

  @ApiResponse({
    description:
      'Only agents can assign themselves to products to sell. 2 at a time.',
    status: 403,
  })
  @ApiResponse({
    description: 'all products assigned to currently signed in agent',
    type: [ProductDtoResponse],
    status: 200,
  })
  @ApiOperation({
    description: 'Assign products to currently signed in agent',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('agents')
  async assignProducts(@Headers('Authorization') token: string) {
    const payload = this.extractPayload(token);
    const products = this.userService.assignProducts(payload.email);

    return products;
  }

  @ApiResponse({
    description: `user with id '{userId} not found`,
    status: 404,
  })
  @ApiResponse({
    description: 'You can only modify your own data',
    status: 403,
  })
  @ApiResponse({
    description: 'Updated user',
    type: UserResponse,
    status: 200,
  })
  @ApiOperation({
    description: 'Update attributes of user matching id query param',
  })
  @ApiHeader({
    name: 'Authorization',
    description: bearerDesc,
    example: exampleToken,
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() attributes: UserDtoUpdate,
    @Headers('Authorization') token: string,
  ) {
    const payload = this.extractPayload(token);
    const updateUser = await this.userService.updateUser(
      payload,
      userId,
      attributes.first_name,
      attributes.last_name,
      attributes.email,
      attributes.password,
      attributes.phone_number,
      attributes.county,
    );

    return updateUser;
  }

  private extractPayload(token: string) {
    const [, originalToken] = token.split(' ');
    const payload = this.jwtService.verify(originalToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return payload;
  }
}
