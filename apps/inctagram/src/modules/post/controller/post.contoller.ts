import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPostFilterDto } from "../filters/get-post.filter";
import { PostQueryRepository } from "../repositories/post-query.repository";
import { Paginated } from "@libs/core/pagination";
import { PostsViewDto } from "../dto/posts-view.dto";



@ApiTags('posts')
@Controller('posts')
export class PostContoller {
    constructor(
        private postQueryRepo: PostQueryRepository
    ) { }


    @ApiResponse({ type: Paginated<PostsViewDto> })
    @Get('')
    async getPostsByUserId(
        @Query() filter: GetPostFilterDto
    ) {
        return this.postQueryRepo.getPosts(filter)
    }
}