import { ApiProperty } from "@nestjs/swagger";

export class PostsViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    url: string
}