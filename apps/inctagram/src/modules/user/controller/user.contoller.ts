import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UpdateUserCommand } from "../use-cases/update/dto/update-user.command";
import { ReqWithUser } from "@libs/types/req-with-user";
import { UpdateUserUseCase } from "../use-cases/update/update-user.use-case";
import { UpdateUserDto } from "../dto/input/update-user.dto";
import { UserQueryRepository } from "../repository/user.query.repository";
import { UserPfofileViewDto } from "../dto/view/user-profile-view.dto";


@ApiTags('users')
@Controller('users')
export class UserContoller {

    constructor(
        private updateUserUseCase: UpdateUserUseCase,
        private userQueryRepo: UserQueryRepository
    ) { }

    @UseGuards(JwtAuthGuard())
    @Put('/profile')
    async updateUserProfile(
        @Body() dto: UpdateUserDto,
        @Req() req: ReqWithUser
    ) {
        const command: UpdateUserCommand = {
            ...dto,
            userId: req.userId
        }
        return this.updateUserUseCase.execute(command)
    }

    @ApiOkResponse({ type: UserPfofileViewDto })
    @UseGuards(JwtAuthGuard())
    @Get('/profile')
    async getUserProfile(
        @Req() req: ReqWithUser,
    ) {
        return this.userQueryRepo.getUserProfileWithAvatar(req.userId)
    }
}