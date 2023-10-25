import { CommandHandler } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';
import { UserQueryRepository } from '../../user/repository/user.query.repository';
import { settings_env } from '@app/common';

export class ValidateUserCommand {
  constructor(
    public email: string,
    public password: string
  ) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(command: ValidateUserCommand) {
    const { email, password } = command;

    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return null;

    const newPasswordHash: string = await bcrypt.hash(
      password,
      settings_env.HASH_ROUNDS
    );
    if (user.password !== newPasswordHash) return null;

    return { id: user.id, username: user.username };
  }
}
