import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResendConfirmationCodeCommand {
    @ApiProperty()
    @IsEmail()
    email: string
}