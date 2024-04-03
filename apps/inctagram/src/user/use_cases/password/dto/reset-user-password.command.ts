import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTrimNotBlank } from '@app/main/utils/validation/is.trim.not.blank.validator';
import { USER_REGISTRATION } from '@app/main/utils/validation/auth.enum';

export class ResetUserPasswordCommand {
  @ApiProperty({ example: 'code from querystring', description: 'code' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  code: string;

  @ApiProperty({ example: 'some1p@sSword', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  @Validate(IsTrimNotBlank)
  @Length(
    USER_REGISTRATION.PASSWORD_MIN_LENGTH,
    USER_REGISTRATION.PASSWORD_MAX_LENGTH,
  )
  password: string;
}
