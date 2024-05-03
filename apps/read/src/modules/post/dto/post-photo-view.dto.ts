import { AspectRatioType } from "@files/src/modules/post/dto/create-post.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PostPhotoViewDto {
    @ApiProperty()
    url: string

    @ApiProperty()
    offsetX: number

    @ApiProperty()
    offsetY: number

    @ApiProperty()
    scale: number

    @ApiProperty({ enum: AspectRatioType })
    aspectRatio: AspectRatioType
}