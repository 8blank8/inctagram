import { CommandHandler } from '@nestjs/cqrs';
import { hash } from 'bcrypt';
import * as querystring from 'querystring';
import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user.query.repository';
import { settings_env } from '@app/common';

export class ResendingConfirmationCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendingConfirmationCodeCommand)
export class ResendingConfirmationCodeUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: ResendingConfirmationCodeCommand): Promise<boolean> {
    const { email } = command;

    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return false;

    const hashedMail = await hash(user.email, settings_env.HASH_ROUNDS);
    const confirmationCode = querystring.stringify({
      userId: user.id,
      code: hashedMail,
    });
    console.log(confirmationCode);
    // this.emailManager.sendEmailConfirmationMessage(
    //   user.email,
    //   confirmationCode,
    // );

    return true;
  }
}
