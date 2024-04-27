import { JwtAuthGuard } from "@libs/guards/jwt.guard";
import { ReqWithUser } from "@libs/types/req-with-user";
import { Body, Controller, Delete, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "../dto/create-post.dto";
import { CreatePostUseCase } from "../use-cases/create/create-post.use-case";
import { CreatePostCommand } from "../use-cases/create/dto/create-post.command";
import { UpdatePostDto } from "../dto/update-post.dto";
import { UpdatePostCommand } from "../use-cases/update/dto/update-post.command";
import { UpdatePostUseCase } from "../use-cases/update/update-post.use-case";
import { DeletePostCommand } from "../use-cases/delete/dto/delete-post.command";
import { DeletePostUseCase } from "../use-cases/delete/delete-post.use-case";


@ApiTags('posts')
@Controller('posts')
export class PostContoller {
    constructor(
        private createPostUseCase: CreatePostUseCase,
        private updatePostUseCase: UpdatePostUseCase,
        private deletePostUseCase: DeletePostUseCase,
    ) { }

    @UseGuards(JwtAuthGuard())
    @Post('')
    @UseInterceptors(FilesInterceptor('files'))
    async createPost(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10_000_000 }),
                    new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
                ],
            }),
        ) files: Array<Express.Multer.File>,
        @Body() dto: CreatePostDto,
        @Req() req: ReqWithUser
    ) {
        const command: CreatePostCommand = {
            aspectRatio: dto.aspectRatio,
            offsetX: dto.offsetX,
            offsetY: dto.offsetY,
            scale: dto.scale,
            location: dto.location,
            description: dto.description,
            files: files,
            userId: req.userId
        }
        return this.createPostUseCase.execute(command)
    }

    @UseGuards(JwtAuthGuard())
    @Put('/:id')
    async updatePost(
        @Param('id') id: string,
        @Body() dto: UpdatePostDto,
        @Req() req: ReqWithUser
    ) {
        const command: UpdatePostCommand = {
            description: dto.description,
            postId: id,
            userId: req.userId
        }

        return this.updatePostUseCase.execute(command)
    }

    @UseGuards(JwtAuthGuard())
    @Delete(':id')
    async deletePostById(
        @Param('id') id: string,
        @Req() req: ReqWithUser
    ) {
        const command: DeletePostCommand = {
            postId: id,
            userId: req.userId
        }

        return this.deletePostUseCase.execute(command)
    }
}