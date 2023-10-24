import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsTrimNotBlank } from '../../utils/validation/is.trim.not.blank.validator';

export class ConfirmationEmailDto {
  /**
   * The name of the Cat
   * @example Kitty
   */
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  hash: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  userId: string;
}