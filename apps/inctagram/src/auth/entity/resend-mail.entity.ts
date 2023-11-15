import { ApiProperty } from '@nestjs/swagger';

export class ResendMailEntity {
  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;
}
