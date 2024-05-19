import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length, Matches, MaxLength, Validate } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @Matches(/^[0-9A-Za-z_-]+$/)
    @Length(6, 30)
    username: string

    @ApiProperty()
    @Length(1, 50)
    @Matches(/^[A-Za-zА-Яа-я]+$/)
    firstname: string;

    @ApiProperty()
    @Length(1, 50)
    @Matches(/^[A-Za-zА-Яа-я]+$/)
    lastname: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @MaxLength(200)
    aboutMe?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/, {
        message: 'Invalid date format. Use dd.mm.yyyy'
    })
    dateOfBirth?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string
}