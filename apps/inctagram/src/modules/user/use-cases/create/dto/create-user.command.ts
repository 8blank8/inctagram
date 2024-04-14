import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches } from "class-validator";

export class CreateUserCommand {
    @ApiProperty()
    @IsString()
    @Matches(/^[0-9A-Za-z_-]+$/)
    @Length(6, 30)
    username: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @Matches(/^[0-9A-Za-z!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+$/)
    password: string
}