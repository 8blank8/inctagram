import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateUserUseCase } from '@app/main/auth/use_cases/login/validate.user.use.case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.validateUserUseCase.execute({
      email: username,
      password: password,
    });

    if (!user || typeof user == 'string') {
      throw new UnauthorizedException(user);
    }
    return user;
  }
}
