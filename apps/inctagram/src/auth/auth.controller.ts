import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import passport from 'passport';

import { LocalAuthGuard } from '@app/auth';
import { GoogleOauthGuard } from '@app/auth/guards/google.oauth.guard';
import { GithubOathGuard } from '@app/auth/guards/github.oauth.guard';
import { ErrorResponse } from '@app/main/auth/entity/error.response';
import { AuthCreatedEntity } from '@app/main/auth/entity/auth.created.entity';
import { MailService, settings_env } from '@app/common';
import { RegisterGoogleUserCommand } from '@app/main/auth/use_cases/register-google-user.use-case';
import { ResendConfirmationCodeCommand } from '@app/main/user/use_cases/resend.confirmation.code.use.case';
import { setAuthTokens } from '@app/main/utils/setAuthTokens';

import { RegisterGithubUserCommand } from './use_cases/register-github-user.use-case';
import { AuthorizeUserCommand } from './use_cases/authorize-user.use-case';
import { CreateUserCommand } from '../user/use_cases/create.user.use.case';
import { EmailConfirmationCommand } from '../user/use_cases/email.confirmation.use.case';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { ConfirmEmailDto } from './dto/confirm.email.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Send test mail' })
  @ApiResponse({
    status: 200,
    description: 'Mail sent',
  })
  @Post('test-mail')
  sendTestMail(
    @Body() mailData: { mailAddress: string; content?: string },
    @Res() res: Response,
  ) {
    this.mailService.testMail(mailData.mailAddress, mailData.content);
    return res.sendStatus(HttpStatus.CREATED);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Log in route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/login')
  async login(@Req() req, @Res() res: Response) {
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(req.user.id, req),
    );
    setAuthTokens(res, token);
    res.status(HttpStatus.OK).send(token);
  }

  @ApiOperation({ summary: 'Register route' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    type: ErrorResponse,
    status: 400,
  })
  @ApiResponse({
    type: AuthCreatedEntity,
    status: HttpStatus.CREATED,
  })
  @Post('/registration')
  async registrationUser(
    @Body() inputData: RegisterUserDto,
    @Res() res: Response,
  ) {
    const exists = await this.authService.findUserByEmail(inputData.email);
    if (!!exists) return res.sendStatus(HttpStatus.BAD_REQUEST);

    const user = await this.commandBus.execute(
      new CreateUserCommand(inputData, true),
    );

    if (!user) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.status(HttpStatus.CREATED).send({ userId: user.id });
  }

  @ApiOperation({
    summary: 'Post Request to confirm code from mail and get access to login',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/confirm-code')
  async confirmationEmail(
    @Body() inputData: ConfirmEmailDto,
    @Res() res: Response,
  ) {
    const isConfirmed = await this.commandBus.execute(
      new EmailConfirmationCommand(inputData),
    );
    if (!isConfirmed) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @ApiOperation({
    summary: 'Re-request for confirmation email',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/resend-email-code')
  async requestEmailCode(
    @Body() inputData: { email: string },
    @Res() res: Response,
  ) {
    await this.commandBus.execute(
      new ResendConfirmationCodeCommand(inputData.email),
    );

    return res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'google auth' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = await this.commandBus.execute(
      new RegisterGoogleUserCommand(req.user),
    );
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(user.id, req),
    );
    setAuthTokens(res, token);
    res.status(HttpStatus.OK).redirect(`${settings_env.FRONT_URL}/`);
  }

  @Get('github')
  @UseGuards(GithubOathGuard)
  async githubAuth() {
    return passport.authenticate('github', { scope: ['user:email'] });
  }

  @Get('callback/github')
  @UseGuards(GithubOathGuard)
  async githubAuthCallback(
    @Req() req,
    @Query('code') code: string,
    @Res() res,
  ) {
    console.log('code => ', code);

    const user = await this.commandBus.execute(
      new RegisterGithubUserCommand(req.user),
    );
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(user.id, req),
    );
    setAuthTokens(res, token);
    return res.redirect(`${settings_env.FRONT_URL}/`);
  }
}
