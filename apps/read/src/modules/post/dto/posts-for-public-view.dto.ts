import { ApiProperty } from "@nestjs/swagger";
import { UserForPostViewDto } from "./user-for-post-view.dto";
import { PostsViewDto } from "./posts-view.dto";


export class PostsForPublicViewDto {
    @ApiProperty()
    id: string

    @ApiProperty({ type: PostsViewDto, isArray: true })
    photos: PostsViewDto[]

    @ApiProperty()
    description: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    user: UserForPostViewDto
}