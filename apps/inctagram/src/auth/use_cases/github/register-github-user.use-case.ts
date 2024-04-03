import { UserRepository } from '@app/main/user/repository/user.repository';
import { RegisterGithubUserCommand } from './dto/register-github-user.command';

export class RegisterGithubUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegisterGithubUserCommand) {
    //TODO LOGIC without email
    const user = await this.userRepository.saveGitHubUser(command.data);

    console.log(user);
    return user;
  }
}
