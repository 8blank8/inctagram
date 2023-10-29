import { CommandHandler } from '@nestjs/cqrs';

export class RegistrationGithubUserCommand {
  constructor(
    public username: string,
    public id: string,
    public avatarUrl: string,
    public fullName: string,
    public email: string,
  ) {}
}

@CommandHandler(RegistrationGithubUserCommand)
export class RegistrationGithubUserUseCase {
  constructor() {}

  async execute(command: RegistrationGithubUserCommand) {
    const { username, id, avatarUrl, fullName, email } = command;

    const user = {
      username,
      id,
      avatarUrl,
      fullName,
      email,
    };

    console.log(user);
  }
}
