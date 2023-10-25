import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsTrimNotBlank } from '../../utils/validation/is.trim.not.blank.validator';
import { USER_REGISTRATION } from '../../utils/validation/auth.enum';

export class RegisterUserDto {
  /**
   * The name of the Cat
   * @example Kitty
   */
  @ApiProperty({ example: 'John Doe', description: 'User name, optional' })
  username: string;

  @ApiProperty({ example: 'some@p@ssword', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  @Length(
    USER_REGISTRATION.PASSWORD_MIN_LENGTH,
    USER_REGISTRATION.PASSWORD_MAX_LENGTH,
  )
  password: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Validate(IsTrimNotBlank)
  email: string;
}
