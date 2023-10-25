import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '@app/auth/guards/google-oauth.guard';
import { RegisterUserDto } from './dto/register.user.dto';
import { ConfirmationEmailDto } from './dto/confirmation.email.dto';
import { LocalAuthGuard } from '@app/auth';
import { CreateDeviceCommand } from '../security/application/use_cases/create.device.use.case';
import { LoginUserCommand } from './use_cases/login.user.use.case';
import { CreateRefreshTokenCommand } from './use_cases/create.refresh.token.use.case';
import { CreateUserCommand } from '../user/use_cases/create.user.use.case';
import { EmailConfirmationCommand } from '../user/use_cases/email.confirmation.use.case';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req, @Res() res: Response) {
    const deviceId = await this.commandBus.execute(
      new CreateDeviceCommand(req.user.id, req.ip, req.headers['user-agent'])
    );

    const token = await this.commandBus.execute(
      new LoginUserCommand(req.user.id)
    );
    const refreshToken = await this.commandBus.execute(
      new CreateRefreshTokenCommand(req.user.id, deviceId)
    );

    res
      .status(HttpStatus.OK)
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .send(token);
  }

  @Post('/registration')
  async registrationUser(
    @Req() req,
    @Body() inputData: RegisterUserDto,
    @Res() res: Response
  ) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(inputData)
    );

    if (!user) return res.sendStatus(HttpStatus.BAD_REQUEST);
    const deviceId = await this.commandBus.execute(
      new CreateDeviceCommand(user.id, req.ip, req.headers['user-agent'])
    );
    const token = await this.commandBus.execute(new LoginUserCommand(user.id));
    const refreshToken = await this.commandBus.execute(
      new CreateRefreshTokenCommand(user.id, deviceId)
    );
    return res
      .status(HttpStatus.CREATED)
      .send({ userId: user.id, token, refreshToken });
  }

  @Post('/confirmation-code')
  async confirmationEmail(
    @Body() inputData: ConfirmationEmailDto,
    @Res() res: Response
  ) {
    const isConfirmed = await this.commandBus.execute(
      new EmailConfirmationCommand(inputData)
    );
    if (!isConfirmed) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return res.status(HttpStatus.OK);
  }
}
