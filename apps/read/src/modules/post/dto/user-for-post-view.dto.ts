import { ApiProperty } from "@nestjs/swagger"
import { AvatarViewDto } from "../../user/dto/avatar-view.dto"

export class UserForPostViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    username: string

    @ApiProperty()
    avatar: AvatarViewDto
}
