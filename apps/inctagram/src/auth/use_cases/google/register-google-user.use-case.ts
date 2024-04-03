import { UserRepository } from '@app/main/user/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { RegisterGoogleUserCommand } from './dto/register-google-user.command';

@Injectable()
export class RegisterGoogleUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(command: RegisterGoogleUserCommand) {
    return await this.userRepository.saveGoogleUser(command.data);
  }
}
