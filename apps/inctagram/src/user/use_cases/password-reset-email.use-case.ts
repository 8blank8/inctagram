import { CommandHandler } from '@nestjs/cqrs';
import { getVerificationCode } from '@app/main/utils/verification.code.util';
import { MailService } from '@app/common';
import { ResendConfirmationCodeCommand } from '@app/main/user/use_cases/resend-confirmation-code.use-case';

import { UserQueryRepository } from '../repository/user-query.repository';

export class PasswordResetMail {
  constructor(public email: string) {}
}

@CommandHandler(PasswordResetMail)
export class PasswordResetMailUseCase {
  constructor(
    private mailService: MailService,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: ResendConfirmationCodeCommand): Promise<boolean> {
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
