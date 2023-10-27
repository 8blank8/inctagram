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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '@app/auth/guards/google-oauth.guard';
import { RegisterUserDto } from './dto/register.user.dto';
import { ConfirmEmailDto } from './dto/confirm.email.dto';
import { LocalAuthGuard } from '@app/auth';
import { AuthorizeUserCommand } from './use_cases/authorizeUserUseCase';
import { CreateUserCommand } from '../user/use_cases/create.user.use.case';
import { EmailConfirmationCommand } from '../user/use_cases/email.confirmation.use.case';
import { ErrorResponse } from '@app/main/auth/entity/error.response';
import { AuthCreatedEntity } from '@app/main/auth/entity/auth.created.entity';
import { MailService } from '@app/common';
import { ResendConfirmationCodeCommand } from '@app/main/user/use_cases/resend.confirmation.code.use.case';

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
    console.log(req.user);
    const token = await this.commandBus.execute(
      new AuthorizeUserCommand(req.user.id, req.ip, req.headers['user-agent']),
    );

    res
      .status(HttpStatus.OK)
      .cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send(token);
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
