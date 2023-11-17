import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ChangeProfileInfoDto } from './dto/change.profile.info.dto';
import { JwtAuthGuard } from '@app/auth';
import { CommandBus } from '@nestjs/cqrs';
import { ChangeProfileInfoCommand } from './use_cases/change-profile-info.use-case';
import { UserQueryRepository } from './repository/user-query.repository';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseEntity } from '../auth/entity/error-response.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private userQueryRepo: UserQueryRepository,
  ) {}

  @ApiOperation({ summary: 'Change Profile' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    type: ErrorResponseEntity,
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    description: 'profile changed',
    status: HttpStatus.NO_CONTENT,
  })
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async changeProfileInfo(
    @Req() req,
    @Res() res: Response,
    @Body() inputData: ChangeProfileInfoDto,
  ) {
    const userId = req.user.id;
    console.log({ userId });
    const isChange = await this.commandBus.execute(
      new ChangeProfileInfoCommand(userId, inputData),
    );
    if (!isChange) res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@Req() req, @Res() res: Response) {
    const userId = req.user.id;

    const user = await this.userQueryRepo.findUserProfileByUserId(userId);
    if (!user) return res.sendStatus(HttpStatus.NOT_FOUND);

    return res.status(HttpStatus.OK).send(user);
  }
}
