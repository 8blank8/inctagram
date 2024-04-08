import { CreateUserUseCase } from '@app/main/user/use_cases/registration/create-user.use-case';
import { CreateUserCommand } from '@app/main/user/use_cases/registration/dto/create-user.command';
import { TestingModule } from '@nestjs/testing';
import { TestSeeder } from '../../../../../../libs/tests/test-seeder';
import { createTestingModule } from '../../../../../../libs/tests/create-testing-module';
import { PrismaClient } from '@prisma/client';
import { AuthorizeUserUseCase } from '../login/authorize-user.use-case';
import { LogOutUserUseCase } from '../logout/log-out.use-case';
import { AuthorizeUserCommand } from '../login/dto/authorize-user.command';
import { LogOutUserCommand } from '../logout/dto/logout-user.command';
import { clearTestDB } from '../../../../../../libs/tests/clear-db';

describe('auth integration', () => {
  jest.setTimeout(8000)
  let moduleRef: TestingModule;
  let testSeeder: TestSeeder;

  let prisma: PrismaClient;

  let createUserUseCase: CreateUserUseCase;
  let authorizeUserUseCase: AuthorizeUserUseCase;
  let logoutUserUseCase: LogOutUserUseCase;

  beforeAll(async () => {
    ({ moduleRef: moduleRef } = await createTestingModule());
    console.log(process.env.DB_URL);

    createUserUseCase = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
    authorizeUserUseCase =
      moduleRef.get<AuthorizeUserUseCase>(AuthorizeUserUseCase);
    logoutUserUseCase = moduleRef.get<LogOutUserUseCase>(LogOutUserUseCase);

    prisma = new PrismaClient();

    testSeeder = new TestSeeder(prisma);
  });

  beforeEach(async () => {
    await clearTestDB(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('create user success', async () => {
    const userDto = testSeeder.getUser();

    const command: CreateUserCommand = {
      sendMail: false,
      user: userDto,
    };

    const user = await createUserUseCase.execute(command);

    expect(user.username).toBe(userDto.username);
    expect(user.email).toBe(userDto.email);
    expect(user.emailConfirmed).toBe(false);

    const findedUser = await prisma.user.findFirst({
      where: { id: user.id },
    });

    expect(findedUser.email).toBe(userDto.email);
    expect(findedUser.username).toBe(userDto.username);
    expect(findedUser.emailConfirmed).toBe(false);
  });

  it('authorize user success', async () => {
    const user = await createUserUseCase.execute({
      sendMail: false,
      user: testSeeder.getUser(),
    });

    const command: AuthorizeUserCommand = {
      ip: '0.0.0.0',
      userAgent: 'non',
      userId: user.id,
    };

    const result = await authorizeUserUseCase.execute(command);

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const findedDevice = await prisma.device.findFirst();

    expect(findedDevice.ip).toBe(command.ip);
    expect(findedDevice.userId).toBe(command.userId);
    expect(findedDevice.title).toBe(command.userAgent);
  });

  it('logout user success', async () => {
    const user = await createUserUseCase.execute({
      sendMail: false,
      user: testSeeder.getUser(),
    });

    await authorizeUserUseCase.execute({
      ip: '0.0.0.0',
      userAgent: 'non',
      userId: user.id,
    });

    const findedDevice = await prisma.device.findFirst();

    const command: LogOutUserCommand = {
      userId: user.id,
      deviceIdOrIp: findedDevice.id,
    };

    await logoutUserUseCase.execute(command);

    const findedDeviceAfterLogout = await prisma.device.findFirst();

    expect(findedDeviceAfterLogout).toBe(null);
  });
});
