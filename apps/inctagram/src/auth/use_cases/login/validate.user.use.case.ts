import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { matchPassword } from '@app/main/utils/verification.code.util';
import { Injectable } from '@nestjs/common';
import { ValidateUserCommand } from './dto/validate-user.command';

@Injectable()
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
