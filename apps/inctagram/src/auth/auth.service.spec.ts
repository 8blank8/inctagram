import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@app/db';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@app/main/user/repository/user.repository';
import { UserQueryRepository } from '@app/main/user/repository/user.query.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        PrismaService,
        UserQueryRepository,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
