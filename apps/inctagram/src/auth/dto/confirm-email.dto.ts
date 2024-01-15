import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsTrimNotBlank } from '../../utils/validation/is.trim.not.blank.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  /**
   * Data to confirm email
   */
  @ApiProperty({ example: 'code from querystring', description: 'code' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  code: string;
}
