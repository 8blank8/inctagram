import { IsTrimNotBlank } from '@app/main/utils/validation/is.trim.not.blank.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

export class EmailConfirmationCommand {
  @ApiProperty({ example: 'code from querystring', description: 'code' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsTrimNotBlank)
  code: string;
}
