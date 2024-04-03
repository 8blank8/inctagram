import {
  encryptVerificationCode,
  hashPassword,
} from '@app/main/utils/verification.code.util';

import { UserQueryRepository } from '../../repository/user-query.repository';
import { UserRepository } from '@app/main/user/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { ResetUserPasswordCommand } from './dto/reset-user-password.command';

@Injectable()
export class ResetUserPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: ResetUserPasswordCommand): Promise<boolean> {
    const { code, password } = command;

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
