import { CommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { settings_env } from '@app/common';

export class LoginUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase {
  constructor(private jwtService: JwtService) {}

  async execute(command: LoginUserCommand) {
    const { id } = command;

    return {
      accessToken: this.jwtService.sign(
        { id: id },
        {
          expiresIn: settings_env.JWT_ACCESS_EXP,
          secret: settings_env.JWT_SECRET,
        }
      ),
    };
  }
}
