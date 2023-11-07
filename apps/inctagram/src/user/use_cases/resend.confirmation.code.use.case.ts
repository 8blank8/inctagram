import { CommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../repository/user-query.repository';
import { getVerificationCode } from '@app/main/utils/verification.code.util';
import { MailService } from '@app/common';

export class ResendConfirmationCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmationCodeCommand)
export class ResendConfirmationCodeUseCase {
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
    await this.mailService.sendEmailConfirmationMessage(email, query);

    return true;
  }
}
