import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseEntity {
  @ApiProperty()
  message: Array<string>;
}
