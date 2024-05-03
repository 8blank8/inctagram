import { ApiProperty } from "@nestjs/swagger";
import { UserForPostViewDto } from "./user-for-post-view.dto";
import { PostPhotoViewDto } from "./post-photo-view.dto";


export class PostForPublicViewDto {
    @ApiProperty()
    id: string

    @ApiProperty({ type: PostPhotoViewDto, isArray: true })
    photos: PostPhotoViewDto[]

    @ApiProperty()
    description: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    user: UserForPostViewDto
}