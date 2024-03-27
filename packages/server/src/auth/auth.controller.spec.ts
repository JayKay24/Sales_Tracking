import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const accessToken = {
    access_token: 'access_token',
  };

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('access_token'),
    };

    const mockAuthService = {
      validateUser: jest
        .fn()
        .mockResolvedValue({ email: 'bruce@example.com', _id: 'someid' }),
      login: jest
        .fn()
        .mockResolvedValue({ email: 'bruce@example.com', _id: 'someid' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should log in the user', async () => {
    jest.spyOn(service, 'login').mockResolvedValue(accessToken);
    const result = await controller.login({
      email: 'bruce@example.com',
      password: 'bruce123',
    });

    expect(result).toStrictEqual(accessToken);
  });
});
