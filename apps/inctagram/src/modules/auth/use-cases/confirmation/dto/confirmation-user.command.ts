import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class ConfirmationUserCommand {
    @ApiProperty()
    @IsString()
    code: string
}