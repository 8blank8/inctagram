import { Body, Controller, Delete, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateUserAvatarDto } from "../dto/input/create-user-avatar.dto";
import { CreateUserAvatarUseCase } from "../use-cases/create-avatar/create-user-avatar.use-case";
import { CreateUserAvatarCommand } from "../use-cases/create-avatar/dto/create-user-avatar.command";
import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { ReqWithUser } from "@libs/types/req-with-user";
import { DeleteUserAvatarCommand } from "../use-cases/delete-avatar/dto/delete-user-avatar.command";
import { DeleteUserAvatarUseCase } from "../use-cases/delete-avatar/delete-user-avatar.use-case";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UserContoller {
    constructor(
        private createUserAvatarUseCase: CreateUserAvatarUseCase,
        private deleteUserAvatarUseCase: DeleteUserAvatarUseCase,
    ) { }

    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard())
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                    new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
                ],
            }),
        ) file: Express.Multer.File,
        @Body() dto: CreateUserAvatarDto,
        @Req() req: ReqWithUser
    ) {
        const command: CreateUserAvatarCommand = {
            dto,
            file,
            userId: req.userId
        }

        return this.createUserAvatarUseCase.execute(command)
    }

    @UseGuards(JwtAuthGuard())
    @Delete('/avatar/:id')
    async deleteUserAvatar(
        @Param('id') id: string,
        @Req() req: ReqWithUser
    ) {
        const command: DeleteUserAvatarCommand = {
            avatarId: id,
            userId: req.userId
        }

        return this.deleteUserAvatarUseCase.execute(command)
    }
}