import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { UserRepository } from '@app/main/user/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userQueryRepository: UserQueryRepository,
    private userRepository: UserRepository,
  ) {}

  generateJwt(payload: { sub: string; email: string }) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    return this.generateJwt({
      sub: user.id,
      email: user.email,
    });
  }
  async findUserByEmail(email?: string) {
    const user =
      await this.userQueryRepository.findUserByUserNameOrEmail(email);
    return user ?? null;
  }
}
