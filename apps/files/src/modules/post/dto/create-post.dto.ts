import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export enum AspectRatioType {
    RATIO_1_1 = "1:1",
    RATIO_4_5 = "4:5",
    RATIO_16_9 = "16:9"
}

export class CreatePostDto {
    @ApiProperty()
    @IsArray()
    @IsNumber({}, { each: true })
    @Max(1, { each: true })
    @Min(0, { each: true })
    offsetX: number

    @ApiProperty()
    @IsArray()
    @IsNumber({}, { each: true })
    @Min(0, { each: true })
    @Max(1, { each: true })
    offsetY: number

    @ApiProperty()
    @IsArray()
    @IsNumber({}, { each: true })
    @Min(1, { each: true })
    @Max(2, { each: true })
    scale: number

    @ApiProperty({ enum: AspectRatioType })
    @IsArray()
    @IsEnum(AspectRatioType, { each: true })
    aspectRatio: AspectRatioType

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    location?: string

    @ApiProperty()
    @IsOptional()
    files?: string
}