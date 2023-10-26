import { CommandHandler } from '@nestjs/cqrs';
import { hash } from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';
import { User } from '@prisma/client';

import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create.user.dto';
import { MailService, settings_env } from '@app/common';
import { getVerificationCode } from '@app/main/utils/verification.code.util';

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
    private mailService: MailService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { user, sendMail } = command;

    let password = null;
    const username = user.username || generateFromEmail(user.email);
    if (user.password) {
      password = await hash(user.password, settings_env.HASH_ROUNDS);
    }

    const createUser = {
      email: user.email,
      password: password,
      username,
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
