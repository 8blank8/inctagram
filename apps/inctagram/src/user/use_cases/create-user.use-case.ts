import { CommandHandler } from '@nestjs/cqrs';
import { generateFromEmail } from 'unique-username-generator';
import { User } from '@prisma/client';

import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create.user.dto';
import { MailService } from '@app/common';
import {
  getVerificationCode,
  hashPassword,
} from '@app/main/utils/verification.code.util';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

export class CreateUserCommand {
  constructor(
    public user: CreateUserDto,
    public sendMail: boolean = false,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private mailService: MailService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { user, sendMail } = command;

    const password = !user.password ? null : hashPassword(user.password);
    let username = user.username;
    // if user auth first time with google or other, generate new unique username
    if (!username) {
      let isUnique = false;
      let randomDigits = 0;
      username = generateFromEmail(user.email, 2);
      while (!isUnique) {
        const found = await this.userQueryRepository.byUserName(username);
        if (!!found) username = generateFromEmail(user.email, randomDigits++);
        isUnique = !found;
      }
    }

    const createUser = {
      email: user.email,
      password: password,
      username,
      userProfile: { create: { firstName: username } },
    };

    const result = await this.userRepository.saveUser(createUser);
    if (sendMail) {
      const query = await getVerificationCode({
        id: result.id,
        email: result.email,
      });

      await this.mailService
        .sendEmailConfirmationMessage(user.email, query)
        .catch(async (e) => {
          await this.userRepository.deleteUser(result.id);
          console.log(e);
          throw new Error('Sending mail error');
        });
    }
    return result;
  }
}
