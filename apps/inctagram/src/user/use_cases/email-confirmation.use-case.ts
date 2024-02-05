import { CommandHandler } from '@nestjs/cqrs';

import { encryptVerificationCode } from '@app/main/utils/verification.code.util';
import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user-query.repository';
import { ConfirmEmailDto } from '../../auth/dto/confirm-email.dto';

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
      payload: { code },
    } = command;

    const { email, id } = await encryptVerificationCode(code);
    if (!id) return false;
    const user = await this.userQueryRepository.findUserById(id);
    if (!user || email !== user.email) return false;

    user.emailConfirmed = true;
    await this.userRepository.saveUser(user);
    return true;
  }
}
