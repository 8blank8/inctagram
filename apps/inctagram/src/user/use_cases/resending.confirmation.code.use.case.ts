import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user.query.repository';
import { EmailManager, settings_env } from '@app/common';
import bcrypt from 'bcrypt';

export class ResendingConfirmationCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendingConfirmationCodeCommand)
export class ResendingConfirmationCodeUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    // private emailManager: EmailManager,
  ) {}

  async execute(command: ResendingConfirmationCodeCommand): Promise<boolean> {
    const { email } = command;

    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return false;

    const hashedMail = bcrypt.hash(user.email, settings_env.HASH_ROUNDS);
    const confirmationCode = JSON.stringify({
      userId: user.id,
      code: hashedMail,
    });
    // this.emailManager.sendEmailConfirmationMessage(
    //   user.email,
    //   confirmationCode,
    // );

    return true;
  }
}
