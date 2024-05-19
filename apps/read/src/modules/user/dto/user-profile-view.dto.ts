import { ApiProperty } from "@nestjs/swagger";
import { AvatarViewDto } from "./avatar-view.dto";

export class UserPfofileViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    username: string;

    @ApiProperty({ nullable: true })
    firstname: string | null;

    @ApiProperty({ nullable: true })
    lastname: string | null;

    @ApiProperty()
    email: string

    @ApiProperty({ nullable: true })
    aboutMe: string | null

    @ApiProperty({ nullable: true })
    dateOfBirth: Date | null

    @ApiProperty({ nullable: true })
    country: string | null

    @ApiProperty({ nullable: true })
    city: string | null

    @ApiProperty({ nullable: true })
    avatar: AvatarViewDto | null

    @ApiProperty()
    createdAt: string

    @ApiProperty({ nullable: true })
    updatedAt: string | null
}