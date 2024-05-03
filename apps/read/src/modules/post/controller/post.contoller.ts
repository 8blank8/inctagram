import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { PostQueryRepository } from "../repositories/post-query.repository";
import { Paginated } from "@libs/core/pagination";
import { PostProfileViewDto } from "../dto/post-profile-view.dto";
import { PostForPublicViewDto } from "../dto/post-for-public-view.dto";
import { JwtOrNotAuthGuard } from "@libs/guards/jwt-or-not.guard";
import { ReqWithUser } from "@libs/types/req-with-user";

class GetPostsViewResponse extends Paginated<PostProfileViewDto> {
    @ApiProperty({ type: PostProfileViewDto, isArray: true })
    items: PostProfileViewDto[]
}


@ApiTags('posts')
@Controller('posts')
export class PostContoller {
    constructor(
        private postQueryRepo: PostQueryRepository
    ) { }


    @ApiResponse({ type: PostForPublicViewDto, isArray: true })
    @Get('public')
    async getPublicPosts() {
        return this.postQueryRepo.getPublicPosts()
    }

    @UseGuards(JwtOrNotAuthGuard())
    @ApiResponse({ type: GetPostsViewResponse })
    @Get('')
    async getPostsByUserId(
        @Query() filter: GetPostFilterDto,
        @Req() req: ReqWithUser
    ) {
        return this.postQueryRepo.getPosts(filter, req.userId)
    }

    @UseGuards(JwtOrNotAuthGuard())
    @Get(':id')
    async getPostById(
        @Param('id') id: string
    ) {
        return this.postQueryRepo.getPostById(id)
    }

}