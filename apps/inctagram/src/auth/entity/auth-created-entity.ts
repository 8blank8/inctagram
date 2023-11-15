import { ApiProperty } from '@nestjs/swagger';

export class AuthCreatedEntity {
  @ApiProperty({ description: 'User id' })
  userId: string;
}
