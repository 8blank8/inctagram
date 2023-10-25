import { CommandHandler } from '@nestjs/cqrs';
import { compareSync } from 'bcrypt';
import { UserQueryRepository } from '@app/main/user/repository/user.query.repository';

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

    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return null;

    const isRightPassword = compareSync(password, user.password);

    if (!isRightPassword) return null;

    return { userId: user.id, ...user };
  }
}
