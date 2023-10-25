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
import { AuthorizeUserCommand } from './use_cases/authorizeUserUseCase';
import { CreateUserCommand } from '../user/use_cases/create.user.use.case';
import { EmailConfirmationCommand } from '../user/use_cases/email.confirmation.use.case';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req, @Res() res: Response) {
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(req.user.id, req.ip, req.headers['user-agent']),
    );

    console.log(token);
    res
      .status(HttpStatus.OK)
      .cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send(token);
  }

  @Post('/registration')
  async registrationUser(
    @Req() req,
    @Body() inputData: RegisterUserDto,
    @Res() res: Response,
  ) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(inputData),
    );

    console.log(user);
    if (!user) return res.sendStatus(HttpStatus.BAD_REQUEST);

    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(user.id, req.ip, req.headers['user-agent']),
    );

    return res.status(HttpStatus.CREATED).send({ userId: user.id, token });
  }

  @Post('/confirmation-code')
  async confirmationEmail(
    @Body() inputData: ConfirmationEmailDto,
    @Res() res: Response,
  ) {
    const isConfirmed = await this.commandBus.execute(
      new EmailConfirmationCommand(inputData),
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
