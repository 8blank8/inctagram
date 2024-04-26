import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateUserAvatarDto {
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    offsetX: number

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    offsetY: number

    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Max(2)
    scale: number

    @ApiProperty()
    @IsOptional()
    file?: string
}