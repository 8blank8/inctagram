import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { UserQueryRepository } from '../repository/user-query.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;
    const user = await this.userQueryRepository.findUserById(id);
    if (!user) return false;

    await this.userRepository.deleteUser(id);
    return true;
  }
}
