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
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import passport from 'passport';

import { JwtAuthGuard, LocalAuthGuard } from '@app/auth';
import { GoogleOauthGuard } from '@app/auth/guards/google.oauth.guard';
import { GithubOathGuard } from '@app/auth/guards/github.oauth.guard';
import { ErrorResponseEntity } from '@app/main/auth/entity/error-response.entity';
import { AuthCreatedEntity } from '@app/main/auth/entity/auth-created-entity';
import { MailService, settings_env } from '@app/common';
import { RegisterGoogleUserCommand } from '@app/main/auth/use_cases/register-google-user.use-case';
import { ResendConfirmationCodeCommand } from '@app/main/user/use_cases/resend-confirmation-code.use-case';
import { setAuthTokens } from '@app/main/utils/setAuthTokens';

import { RegisterGithubUserCommand } from '../use_cases/register-github-user.use-case';
import { AuthorizeUserCommand } from '../use_cases/authorize-user.use-case';
import { CreateUserCommand } from '../../user/use_cases/create-user.use-case';
import { EmailConfirmationCommand } from '../../user/use_cases/email-confirmation.use-case';
import { AuthService } from '../auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';
import { TestMailEntity } from '@app/main/auth/entity/test-mail.entity';
import { ResendMailEntity } from '@app/main/auth/entity/resend-mail.entity';
import { TokenEntity } from '@app/main/auth/entity/token.entity';
import { LoginDataEntity } from '@app/main/auth/entity/login-data.entity';
import { PasswordResetMail } from '@app/main/user/use_cases/password-reset-email.use-case';
import { ResetPasswordDto } from '@app/main/auth/dto/reset-password.dto';
import { ResetUserPassword } from '@app/main/user/use_cases/reset-user-password.use-case';
import { FullUserEntity } from '@app/main/user/entity/full-user.entity';
import { LogOutUserCommand } from '@app/main/auth/use_cases/log-out.use-case';
import { BadRequestApiResponse, CreatedApiResponse, ForbiddenApiResponse, IternalServerErrorApiResponse, OkApiResponse, UnauthorizedApiResponse } from 'libs/swagger/swagger.decorator';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private commandBus: CommandBus,
    private mailService: MailService,
  ) { }

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
    @Req() req,
    @Body() body: LoginDataEntity,
    @Ip() ip,
    @Res() res: Response,
  ) {
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(req.user.id, req, ip),
    );
    setAuthTokens(res, token);
    res.status(HttpStatus.OK).send(token);
  }

  @UseGuards(JwtAuthGuard)
  @ForbiddenApiResponse()
  @OkApiResponse()
  @Get('/logout')
  async logout(@Req() req, @Ip() ip) {
    return this.commandBus.execute(
      new LogOutUserCommand(req.user.id, ip ?? req.user.deviceId),
    );
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
    const user = await this.commandBus.execute(
      new CreateUserCommand(inputData, process.env.MODE === 'TESTING'),
    );

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
    @Body() inputData: ConfirmEmailDto,
    @Res() res: Response,
  ) {
    const isConfirmed = await this.commandBus.execute(
      new EmailConfirmationCommand(inputData),
    );
    // TODO: remove userId from request;
    if (!isConfirmed) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.OK);
  }

  @ForbiddenApiResponse()
  @OkApiResponse(null, 'Mail sent')
  @Post('/resend-email-code')
  async requestEmailCode(
    @Body() inputData: ResendMailEntity,
    @Res() res: Response,
  ) {
    await this.commandBus.execute(
      new ResendConfirmationCodeCommand(inputData.email),
    );

    return res.sendStatus(HttpStatus.OK);
  }

  @BadRequestApiResponse()
  @OkApiResponse(null, 'Mail sent')
  @Post('/password-recovery-email')
  async passwordRecoveryEmailCode(
    @Body() inputData: ResendMailEntity,
    @Res() res: Response,
  ) {
    const sent = await this.commandBus.execute(
      new PasswordResetMail(inputData.email),
    );
    if (!sent) return res.sendStatus(HttpStatus.BAD_REQUEST);
    return res.sendStatus(HttpStatus.OK);
  }

  @BadRequestApiResponse()
  @OkApiResponse(null, 'New password applied')
  @Post('/change-password')
  async changePassword(
    @Body() inputData: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.commandBus.execute(
      new ResetUserPassword(inputData),
    );
    if (!result) return res.sendStatus(HttpStatus.BAD_REQUEST);
    return res.sendStatus(HttpStatus.OK);
  }

  @OkApiResponse(null, 'will redirect to google auth page')
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() { }

  @ApiExcludeEndpoint()
  // @ApiOperation({
  //   summary:
  //     'after success will redirect to "/auth-confirmed" with accessToken & refreshToken in query',
  // })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Ip() ip, @Res() res: Response) {
    const user = await this.commandBus.execute(
      new RegisterGoogleUserCommand(req.user),
    );
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(user.id, req, ip),
    );
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

    const user = await this.commandBus.execute(
      new RegisterGithubUserCommand(req.user),
    );
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(user.id, req, ip),
    );
    setAuthTokens(res, token);
    return res.redirect(`${settings_env.FRONT_URL}/`);
  }
}
