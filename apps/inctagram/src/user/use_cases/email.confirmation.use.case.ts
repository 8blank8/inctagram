import { CommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user.query.repository';
import { ConfirmEmailDto } from '../../auth/dto/confirm.email.dto';
import { compareVerificationCode } from '@app/main/utils/verification.code.util';

export class EmailConfirmationCommand {
  constructor(public payload: ConfirmEmailDto) {}
}

@CommandHandler(EmailConfirmationCommand)
export class EmailConfirmationUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: EmailConfirmationCommand): Promise<boolean> {
    const {
      payload: { code, userId },
    } = command;
    const user = await this.userQueryRepository.findUserById(userId);
    if (!user) return false;

    const isComapre = await compareVerificationCode({
      code,
      id: userId,
      email: user.email,
    });
    if (!isComapre) return false;

    user.emailConfirmed = true;
    await this.userRepository.saveUser(user);
    return true;
  }
}
