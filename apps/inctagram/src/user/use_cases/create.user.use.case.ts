import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create.user.dto';
import { settings_env } from '@app/common';
import { hash } from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';
import { User } from '@prisma/client';

export class CreateUserCommand {
  constructor(
    public user: CreateUserDto,
    public sendMail: boolean = true,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository, // private emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { user, sendMail } = command;

    let password = null;
    const username = user.username || generateFromEmail(user.email);
    if (user.password) {
      password = await hash(user.password, settings_env.HASH_ROUNDS);
    }

    console.log(password);
    const createUser = {
      email: user.email,
      password: password,
      username,
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
    return res;
  }
}
