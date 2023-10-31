import { ApiProperty } from '@nestjs/swagger';

export class ConfirmMailEntity {
  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  mailAddress: string;

  @ApiProperty({
    example: 'some content of mail',
    description: 'content of mail',
  })
  content: string;
}
