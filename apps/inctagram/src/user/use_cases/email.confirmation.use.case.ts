import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user.query.repository';
import bcrypt from 'bcrypt';
import { ConfirmationEmailDto } from "../../auth/dto/confirmation.email.dto";

export class EmailConfirmationCommand {
  constructor(public code: ConfirmationEmailDto) {}
}

@CommandHandler(EmailConfirmationCommand)
export class EmailConfirmationUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: EmailConfirmationCommand): Promise<boolean> {
    const { code } = command;
    const user = await this.userQueryRepository.findUserById(code.userId);
    if (!user) return false;
    const isComapre = await bcrypt.compare(code.hash, user.email);

    if (!isComapre) return false;

    // await this.userRepository.updateConfirmationEmail(true, confirmationData.userId)
    user.emailConfirmed = true;
    await this.userRepository.saveUser(user);
    return true;
  }
}
