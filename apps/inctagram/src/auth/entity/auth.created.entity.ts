import { ApiProperty } from '@nestjs/swagger';

export class AuthCreatedEntity {
  @ApiProperty()
  userId: string;
  token: {
    authToken: string;
  };
}
