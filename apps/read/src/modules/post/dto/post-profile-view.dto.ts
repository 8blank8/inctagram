import { ApiProperty } from "@nestjs/swagger";
import { PostPhotoViewDto } from "./post-photo-view.dto";

export class PostProfileViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    cursor: number

    @ApiProperty({ type: PostPhotoViewDto })
    photo: PostPhotoViewDto
}