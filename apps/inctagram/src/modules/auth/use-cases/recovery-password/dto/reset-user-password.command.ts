import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches } from "class-validator"


export class ResetUserPasswordCommand {
    @ApiProperty()
    @IsString()
    code: string

    @ApiProperty()
    @IsString()
    @Matches(/^[0-9A-Za-z!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+$/)
    password: string
}