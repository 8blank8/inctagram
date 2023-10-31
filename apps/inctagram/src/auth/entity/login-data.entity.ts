import { ApiProperty } from '@nestjs/swagger';

export class LoginDataEntity {
  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;

  @ApiProperty({ example: 'some_password!1', description: 'User password' })
  password: string;
}
