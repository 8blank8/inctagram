import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@app/main/user/repository/user.repository';

export interface GitUserData {
  username: string;
  login: string;
  providerId: string;
  avatarUrl: string;
  displayName: string;
  email: string;
}

export class RegisterGithubUserCommand {
  constructor(public data: GitUserData) {}
}

@CommandHandler(RegisterGithubUserCommand)
export class RegisterGithubUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegisterGithubUserCommand) {
    const user = await this.userRepository.saveGitHubUser(command.data);

    console.log(user);
  }
}
