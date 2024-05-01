import { ApiProperty } from "@nestjs/swagger"

export class AvatarViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    url: string

    @ApiProperty()
    offsetX: number

    @ApiProperty()
    offsetY: number

    @ApiProperty()
    scale: number

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    updatedAt: string | null
}

