import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@app/main/user/repository/user.repository';

export interface GoogleUserData {
  username: string;
  login: string;
  providerId: string;
  avatarUrl: string;
  displayName: string;
  givenName: string;
  familyName: string;
  email: string;
}
export class RegisterGoogleUserCommand {
  constructor(public data: GoogleUserData) {}
}

@CommandHandler(RegisterGoogleUserCommand)
export class RegisterGoogleUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegisterGoogleUserCommand) {
    return await this.userRepository.saveGoogleUser(command.data);
  }
}
