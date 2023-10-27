import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail } from 'unique-username-generator';

import { RegisterUserDto } from './dto/register.user.dto';
import { UserQueryRepository } from '@app/main/user/repository/user.query.repository';
import { UserRepository } from '@app/main/user/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userQueryRepository: UserQueryRepository,
    private userRepository: UserRepository,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: RegisterUserDto) {
    // TODO: move all methods in use_cases
    try {
      const username =
        user.username ?? (await generateFromEmail(user.email, 5));
      const newUser = { ...user, username };
      const result = await this.userRepository.saveUser(newUser);

      return this.generateJwt({
        sub: result.id,
        email: result.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email?: string) {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    return user ?? null;
  }
}
