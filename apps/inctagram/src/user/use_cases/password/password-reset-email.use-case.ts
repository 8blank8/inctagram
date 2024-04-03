import { getVerificationCode } from '@app/main/utils/verification.code.util';
import { MailService } from '@app/common';

import { UserQueryRepository } from '../../repository/user-query.repository';
import { PasswordResetEmailCommand } from './dto/password-reset-email.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordResetMailUseCase {
  constructor(
    private mailService: MailService,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: PasswordResetEmailCommand): Promise<boolean> {
    const { email } = command;

    const user = await this.userQueryRepository.byUserNameOrEmail(email);
    if (!user) return false;

    const query = await getVerificationCode({
      id: user.id,
      email: user.email,
    });
    await this.mailService.sendEmailPassRecovery(email, query);

    return true;
  }
}
