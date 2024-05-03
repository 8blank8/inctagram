import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ReqWithUser } from "@libs/types/req-with-user";
import { UserQueryRepository } from "../repositories/user-query.repository";
import { UserPfofileViewDto } from "../dto/user-profile-view.dto";
import { JwtOrNotAuthGuard } from "@libs/guards/jwt-or-not.guard";


@ApiTags('users')
@Controller('users')
export class UserContoller {

    constructor(
        private userQueryRepo: UserQueryRepository
    ) { }

    @ApiOkResponse({ type: UserPfofileViewDto })
    @UseGuards(JwtAuthGuard())
    @Get('/me')
    async getMyProfile(
        @Req() req: ReqWithUser,
    ) {
        return this.userQueryRepo.getUserProfileWithAvatar(req.userId, true)
    }

    @UseGuards(JwtOrNotAuthGuard())
    @Get('/profile/:id')
    async getUserProfileById(
        @Param('id') id: string,
        @Req() req: ReqWithUser
    ) {
        return this.userQueryRepo.getUserProfileWithAvatar(id, !!req.userId)
    }
}