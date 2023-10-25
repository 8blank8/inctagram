import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  /**
   * The name of the User
   * @example John
   */
  @ApiProperty({ example: 'John Doe', description: 'User name, required' })
  username: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User password' })
  password?: string | null;
}
