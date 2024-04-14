import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


export class SendRecoveryPasswordCodeCommand {
    @ApiProperty()
    @IsEmail()
    email: string
}