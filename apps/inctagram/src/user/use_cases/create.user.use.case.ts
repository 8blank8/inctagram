import { CommandHandler } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create.user.dto';
import { EmailManager, settings_env } from '@app/common';

export class CreateUserCommand {
  constructor(
    public user: CreateUserDto,
    public sendMail: boolean = true,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    // private emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { user, sendMail } = command;

    const hashedPassword = await bcrypt.hash(
      user.password,
      settings_env.HASH_ROUNDS,
    );

    const createUser = {
      email: user.email,
      password: hashedPassword,
    };

    const res = await this.userRepository.saveUser(createUser);

    // if (sendMail) {
    //   const hashedMail = bcrypt.hash(user.email, settings_env.HASH_ROUNDS);
    //   const confirmationCode = JSON.stringify({
    //     userId: res.id,
    //     code: hashedMail,
    //   });
    //   this.emailManager.sendEmailConfirmationMessage(
    //     user.email,
    //     confirmationCode,
    //   );
    // }
    return res.id;
  }
}
