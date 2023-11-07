import { CommandHandler } from '@nestjs/cqrs';
import {
  compareVerificationCode,
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
      data: { code, userId, password },
    } = command;

    const user = await this.userQueryRepository.findUserById(userId);
    if (!user || !user.emailConfirmed) return false;

    const isCompare = await compareVerificationCode({
      code,
      id: userId,
      email: user.email,
    });
    if (!isCompare) return false;

    user.password = hashPassword(password);
    await this.userRepository.saveUser(user);

    return true;
  }
}
