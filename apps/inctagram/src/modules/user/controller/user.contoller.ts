import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { Body, Controller, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UpdateUserCommand } from "../use-cases/update/dto/update-user.command";
import { ReqWithUser } from "@libs/types/req-with-user";
import { UpdateUserUseCase } from "../use-cases/update/update-user.use-case";
import { UpdateUserDto } from "../dto/update-user.dto";


@ApiTags('users')
@Controller('users')
export class UserContoller {

    constructor(
        private updateUserUseCase: UpdateUserUseCase,
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
}