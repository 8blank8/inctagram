import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsTrimNotBlank } from '../../utils/validation/is.trim.not.blank.validator';

export class ConfirmEmailDto {
  /**
   * The name of the Cat
   * @example Kitty
   */
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  userId: string;
}
