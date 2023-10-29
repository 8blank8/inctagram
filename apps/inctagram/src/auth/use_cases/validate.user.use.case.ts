import { CommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { matchPassword } from '@app/main/utils/verification.code.util';

export class ValidateUserCommand {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(command: ValidateUserCommand) {
    const { email, password } = command;

    const user =
      await this.userQueryRepository.findUserByUserNameOrEmail(email);
    if (!user) return null;

    const isRightPassword = matchPassword(password, user.password);

    if (!isRightPassword) return null;

    return { userId: user.id, ...user };
  }
}
