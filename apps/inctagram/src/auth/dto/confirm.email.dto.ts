import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsTrimNotBlank } from '../../utils/validation/is.trim.not.blank.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  /**
   * The name of the Cat
   * @example Kitty
   */
  @ApiProperty({ example: 'code from querystring', description: 'code' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  code: string;

  @ApiProperty({ example: 'userId from querystring', description: 'userId' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  userId: string;
}
