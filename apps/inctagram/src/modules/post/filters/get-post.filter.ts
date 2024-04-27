import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetPostFilterDto {
    @ApiProperty()
    @IsNumber()
    size: number

    @ApiProperty()
    @IsNumber()
    page: number

    @ApiProperty()
    @IsString()
    userId: string
}