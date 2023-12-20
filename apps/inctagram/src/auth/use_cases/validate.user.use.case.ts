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

    const user = await this.userQueryRepository.byUserNameOrEmail(email);

    if (!user) return 'Wrong email or password';
    if (!user.emailConfirmed) return 'User email not confirmed!';

    const isRightPassword = matchPassword(password, user.password);

    if (!isRightPassword) return 'Wrong email or password';

    return { userId: user.id, ...user };
  }
}
