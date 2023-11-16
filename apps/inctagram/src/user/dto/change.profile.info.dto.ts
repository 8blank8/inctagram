import { USER_REGISTRATION } from '@app/main/utils/validation/auth.enum';
import { IsTrimNotBlank } from '@app/main/utils/validation/is.trim.not.blank.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';

export class ChangeProfileInfoDto {
  @ApiProperty({ example: 'John-Doe', description: 'User name, required' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  @Matches(/^[0-9A-Za-z_-]*$/)
  @Length(
    USER_REGISTRATION.USERNAME_MIN_LENGTH,
    USER_REGISTRATION.USERNAME_MAX_LENGTH,
  )
  username: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  @Matches(/^[A-Za-zА-Яа-я]*$/)
  @Length(
    USER_REGISTRATION.FISTNAME_MIN_LENGTH,
    USER_REGISTRATION.FISTNAME_MAX_LENGTH,
  )
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  @Matches(/^[A-Za-zА-Яа-я]*$/)
  @Length(
    USER_REGISTRATION.FISTNAME_MIN_LENGTH,
    USER_REGISTRATION.FISTNAME_MAX_LENGTH,
  )
  lastname: string;

  @ApiProperty({ example: '01.01.2023' })
  @IsNotEmpty()
  @IsString()
  // @IsDateString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/)
  @Validate(IsTrimNotBlank)
  dateOfBirth: string;

  @ApiProperty({ example: 'any text' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  @Matches(/^[0-9A-Za-zА-Яа-я\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/)
  @Length(0, 200)
  aboutMe: string;
}
