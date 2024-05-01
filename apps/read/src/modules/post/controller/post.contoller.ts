import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { PostQueryRepository } from "../repositories/post-query.repository";
import { Paginated } from "@libs/core/pagination";
import { PostProfileViewDto } from "../dto/post-profile-view.dto";
import { PostForPublicViewDto } from "../dto/post-for-public-view.dto";

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

    @ApiResponse({ type: GetPostsViewResponse })
    @Get('')
    async getPostsByUserId(
        @Query() filter: GetPostFilterDto
    ) {
        return this.postQueryRepo.getPosts(filter)
    }

    @Get(':id')
    async getPostById(
        @Param('id') id: string
    ) {
        return this.postQueryRepo.getPostById(id)
    }

}