import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail } from 'unique-username-generator';
import { PrismaService } from '@app/db';

import { RegisterUserDto } from './dto/register.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
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
    try {
      const newUser = await this.prisma.user.create({ data: user });
      newUser.username = await generateFromEmail(user.email, 5);

      await this.prisma.user.update({
        where: { id: newUser.id },
        data: newUser,
      });

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email?: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user ?? null;
  }
}
