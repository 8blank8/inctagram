import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetPostFilterDto {
    @ApiProperty()
    @IsNumber()
    size: number

    @ApiProperty()
    @IsNumber()
    cursor: number

    @ApiProperty()
    @IsString()
    userId: string
}