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
import { ChangeProfileInfoDto } from '../dto/change.profile.info.dto';
import { JwtAuthGuard } from '@app/auth';
import { ChangeProfileInfoUseCase } from '../use_cases/update/change-profile-info.use-case';
import { UserQueryRepository } from '../repository/user-query.repository';
import { ApiTags } from '@nestjs/swagger';
import { UserProfileViewEntity } from '../entity/user-profile-view.entity';
import {
  ErrorApiResponse,
  NoContentApiResponse,
  NotFoundApiResponse,
  OkApiResponse,
  UnauthorizedApiResponse,
} from '../../../../../libs/swagger/swagger.decorator';
import { ChangeProfileInfoCommand } from '../use_cases/update/change-profile-info.command';
import { ReqWithUser } from '../../../../../libs/types/types';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userQueryRepo: UserQueryRepository,
    private changeProfileInfoUseCase: ChangeProfileInfoUseCase,
  ) { }

  @UnauthorizedApiResponse()
  @NoContentApiResponse('profile changed')
  @ErrorApiResponse()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async changeProfileInfo(
    @Req() req: ReqWithUser,
    @Res() res: Response,
    @Body() dto: ChangeProfileInfoDto,
  ) {
    const command: ChangeProfileInfoCommand = {
      userId: req.user.id,
      inputData: dto,
    };

    const isChange = await this.changeProfileInfoUseCase.execute(command);
    if (!isChange) return res.sendStatus(HttpStatus.BAD_REQUEST);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UnauthorizedApiResponse()
  @NotFoundApiResponse("if user doesn't not exist")
  @OkApiResponse(UserProfileViewEntity, 'user is found')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@Req() req: ReqWithUser, @Res() res: Response) {
    const userId = req.user.id;

    const user = await this.userQueryRepo.findUserProfileByUserId(userId);
    if (!user) return res.sendStatus(HttpStatus.NOT_FOUND);

    return res.status(HttpStatus.OK).send(user);
  }
}
