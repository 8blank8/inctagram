import { RegisterUserDto } from '@app/main/auth/dto/register-user.dto';
import { hashPassword } from '@app/main/utils/verification.code.util';
import { PrismaClient, User } from '@prisma/client';

export class TestSeeder {
  private testDataCreator: TestDataCreator;

  constructor(private prisma: PrismaClient) {
    this.testDataCreator = new TestDataCreator(this.prisma);
  }

  getUser(): RegisterUserDto {
    return {
      username: 'username',
      email: 'test@gmail.com',
      password: 'password1$$',
    };
  }

  createUser(userDto: RegisterUserDto): Promise<User> {
    return this.testDataCreator.createUser(userDto);
  }

}

class TestDataCreator {
  constructor(private prisma: PrismaClient) { }

  createUser(dto: RegisterUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashPassword(dto.password),
        emailConfirmed: true,
      },
    });
  }
}
