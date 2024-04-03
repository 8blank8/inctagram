import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import passport from 'passport';

import { JwtAuthGuard, LocalAuthGuard } from '@app/auth';
import { GoogleOauthGuard } from '@app/auth/guards/google.oauth.guard';
import { GithubOathGuard } from '@app/auth/guards/github.oauth.guard';
import { AuthCreatedEntity } from '@app/main/auth/entity/auth-created-entity';
import { MailService, settings_env } from '@app/common';
import { setAuthTokens } from '@app/main/utils/setAuthTokens';

import { RegisterGithubUserUseCase } from '../use_cases/github/register-github-user.use-case';
import { AuthorizeUserUseCase } from '../use_cases/login/authorize-user.use-case';
import { AuthService } from '../auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { TestMailEntity } from '@app/main/auth/entity/test-mail.entity';
import { TokenEntity } from '@app/main/auth/entity/token.entity';
import { LoginDataEntity } from '@app/main/auth/entity/login-data.entity';
import { FullUserEntity } from '@app/main/user/entity/full-user.entity';
import {
  BadRequestApiResponse,
  CreatedApiResponse,
  ForbiddenApiResponse,
  IternalServerErrorApiResponse,
  OkApiResponse,
  UnauthorizedApiResponse,
} from '../../../../../libs/swagger/swagger.decorator';
import { AuthorizeUserCommand } from '../use_cases/login/dto/authorize-user.command';
import { ReqWithUser } from 'libs/types/types';
import { RegisterGoogleUserUseCase } from '../use_cases/google/register-google-user.use-case';
import { LogOutUserUseCase } from '../use_cases/logout/log-out.use-case';
import { EmailConfirmationUseCase } from '@app/main/user/use_cases/email/email-confirmation.use-case';
import { ResendConfirmationCodeUseCase } from '@app/main/user/use_cases/email/resend-confirmation-code.use-case';
import { EmailConfirmationCommand } from '@app/main/user/use_cases/email/dto/email-confirmation.command';
import { ResendConfirmationCodeCommand } from '@app/main/user/use_cases/email/dto/resend-confirmation-code.command';
import { PasswordResetEmailCommand } from '@app/main/user/use_cases/password/dto/password-reset-email.command';
import { PasswordResetMailUseCase } from '@app/main/user/use_cases/password/password-reset-email.use-case';
import { ResetUserPasswordUseCase } from '@app/main/user/use_cases/password/reset-user-password.use-case';
import { ResetUserPasswordCommand } from '@app/main/user/use_cases/password/dto/reset-user-password.command';
import { CreateUserUseCase } from '@app/main/user/use_cases/registration/create-user.use-case';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus,
    private mailService: MailService,
    private authorizeUserUseCase: AuthorizeUserUseCase,
    private registerGoogleUserUseCase: RegisterGoogleUserUseCase,
    private registerGithubUserUseCase: RegisterGithubUserUseCase,
    private logoutUserUseCase: LogOutUserUseCase,
    private emailConfirmationUseCase: EmailConfirmationUseCase,
    private resendConfirmationCodeUseCase: ResendConfirmationCodeUseCase,
    private passwordResetMailUseCase: PasswordResetMailUseCase,
    private resetUserPasswordUseCase: ResetUserPasswordUseCase,
    private createUserUseCase: CreateUserUseCase,
  ) {}

  @CreatedApiResponse('Mail sent', TestMailEntity)
  @Post('test-mail')
  sendTestMail(@Body() mailData: TestMailEntity, @Res() res: Response) {
    this.mailService.testMail(mailData.mailAddress, mailData.content);
    return res.sendStatus(HttpStatus.CREATED).send(mailData);
  }

  @UseGuards(LocalAuthGuard)
  @ForbiddenApiResponse()
  @OkApiResponse(TokenEntity)
  @Post('/login')
  async login(
    @Req() req: ReqWithUser,
    @Body() body: LoginDataEntity,
    @Ip() ip,
    @Res() res: Response,
  ) {
    const command: AuthorizeUserCommand = {
      userId: req.user.id,
      userAgent: req.headers['user-agent'],
      ip: ip,
    };

    const token = await this.authorizeUserUseCase.execute(command);

    setAuthTokens(res, token);
    res.status(HttpStatus.OK).send(token);
  }

  @UseGuards(JwtAuthGuard)
  @ForbiddenApiResponse()
  @OkApiResponse()
  @Get('/logout')
  async logout(@Req() req, @Ip() ip) {
    return this.logoutUserUseCase.execute({
      userId: req.user.id,
      deviceIdOrIp: ip ?? req.user.deviceId,
    });
  }

  @ForbiddenApiResponse()
  @BadRequestApiResponse()
  @CreatedApiResponse('', AuthCreatedEntity)
  @Post('/registration')
  async registrationUser(
    @Body() inputData: RegisterUserDto,
    @Res() res: Response,
  ) {
    const exists = await this.authService.findUserByEmail(inputData.email);
    if (!!exists && exists.emailConfirmed)
      return res.sendStatus(HttpStatus.BAD_REQUEST);
    // TODO: change to true when mail service will repared
    const user = await this.createUserUseCase.execute({
      user: inputData,
      sendMail: process.env.MODE === 'TESTING',
    });

    if (!user) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.status(HttpStatus.CREATED).send();
  }

  @UseGuards(JwtAuthGuard)
  @UnauthorizedApiResponse()
  @IternalServerErrorApiResponse()
  @OkApiResponse(FullUserEntity)
  @Get('/me')
  async getMe(@Req() req, @Res() res: Response) {
    const data = await this.authService.getFullUserData(req.user.id);
    return res.status(HttpStatus.OK).send(data);
  }

  @ForbiddenApiResponse()
  @OkApiResponse()
  @Post('/confirm-code')
  async confirmationEmail(
    @Body() inputData: EmailConfirmationCommand,
    @Res() res: Response,
  ) {
    const isConfirmed = await this.emailConfirmationUseCase.execute(inputData);
    // TODO: remove userId from request;
    if (!isConfirmed) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.OK);
  }

  @ForbiddenApiResponse()
  @OkApiResponse(null, 'Mail sent')
  @Post('/resend-email-code')
  async requestEmailCode(
    @Body() inputData: ResendConfirmationCodeCommand,
    @Res() res: Response,
  ) {
    await this.resendConfirmationCodeUseCase.execute(inputData);

    return res.sendStatus(HttpStatus.OK);
  }

  @BadRequestApiResponse()
  @OkApiResponse(null, 'Mail sent')
  @Post('/password-recovery-email')
  async passwordRecoveryEmailCode(
    @Body() inputData: PasswordResetEmailCommand,
    @Res() res: Response,
  ) {
    const sent = await this.passwordResetMailUseCase.execute(inputData);
    if (!sent) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.OK);
  }

  @BadRequestApiResponse()
  @OkApiResponse(null, 'New password applied')
  @Post('/change-password')
  async changePassword(
    @Body() inputData: ResetUserPasswordCommand,
    @Res() res: Response,
  ) {
    const result = await this.resetUserPasswordUseCase.execute(inputData);
    if (!result) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.OK);
  }

  @OkApiResponse(null, 'will redirect to google auth page')
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @ApiExcludeEndpoint()
  // @ApiOperation({
  //   summary:
  //     'after success will redirect to "/auth-confirmed" with accessToken & refreshToken in query',
  // })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Ip() ip, @Res() res: Response) {
    const user = await this.registerGoogleUserUseCase.execute(req.user);

    const token = await this.authorizeUserUseCase.execute({
      userId: user.id,
      userAgent: req.headers['user-agent'],
      ip: ip,
    });

    setAuthTokens(res, token);

    res
      .status(HttpStatus.OK)
      .setHeader('access-token', token.accessToken)
      .setHeader('refresh-token', token.refreshToken)
      .redirect(
        `${settings_env.FRONT_URL}/auth-confirmed?accessToken=${token.accessToken}&refreshToken=${token.refreshToken}`,
      );
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
    @Ip() ip,
    @Query('code') code: string,
    @Res() res,
  ) {
    console.log('code => ', code);

    const user = await this.registerGithubUserUseCase.execute(req.user);

    const token = await this.authorizeUserUseCase.execute({
      userId: user.id,
      userAgent: req.headers['user-agent'],
      ip: ip,
    });

    setAuthTokens(res, token);
    return res.redirect(`${settings_env.FRONT_URL}/`);
  }
}
