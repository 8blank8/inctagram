import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ReqWithUser } from "@libs/types/req-with-user";
import { UserQueryRepository } from "../repositories/user-query.repository";
import { UserPfofileViewDto } from "../dto/user-profile-view.dto";


@ApiTags('users')
@Controller('users')
export class UserContoller {

    constructor(
        private userQueryRepo: UserQueryRepository
    ) { }

    @ApiOkResponse({ type: UserPfofileViewDto })
    @UseGuards(JwtAuthGuard())
    @Get('/profile')
    async getUserProfile(
        @Req() req: ReqWithUser,
    ) {
        return this.userQueryRepo.getUserProfileWithAvatar(req.userId)
    }
}