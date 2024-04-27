import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { PostQueryRepository } from "../repositories/post-query.repository";
import { Paginated } from "@libs/core/pagination";
import { PostsViewDto } from "../dto/posts-view.dto";

class GetPostsViewResponse extends Paginated<PostsViewDto> {
    @ApiProperty({ type: PostsViewDto, isArray: true })
    items: PostsViewDto[]
}


@ApiTags('posts')
@Controller('posts')
export class PostContoller {
    constructor(
        private postQueryRepo: PostQueryRepository
    ) { }


    @ApiResponse({ type: GetPostsViewResponse })
    @Get('')
    async getPostsByUserId(
        @Query() filter: GetPostFilterDto
    ) {
        return this.postQueryRepo.getPosts(filter)
    }
}