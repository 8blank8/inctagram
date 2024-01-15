import { CommandHandler } from '@nestjs/cqrs';
import {
  encryptVerificationCode,
  hashPassword,
} from '@app/main/utils/verification.code.util';

import { UserQueryRepository } from '../repository/user-query.repository';
import { UserRepository } from '@app/main/user/repository/user.repository';
import { ResetPasswordDto } from '@app/main/auth/dto/reset-password.dto';

export class ResetUserPassword {
  constructor(public data: ResetPasswordDto) {}
}

@CommandHandler(ResetUserPassword)
export class ResetUserPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: ResetUserPassword): Promise<boolean> {
    const {
      data: { code, password },
    } = command;

    const { id, email } = await encryptVerificationCode(code);
    const user = await this.userQueryRepository.findUserById(id);

    if (!user || !user.emailConfirmed) return false;

    if (email !== user.email) return false;

    // TODO: broke all sessions
    user.password = hashPassword(password);
    await this.userRepository.saveUser(user);

    return true;
  }
}
