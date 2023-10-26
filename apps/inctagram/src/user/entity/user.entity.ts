import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  /**
   * The name of the User
   * @example John
   */
  @ApiProperty({ example: 'asdw1asdw2dad2m', description: 'User id' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'User name, required' })
  username: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;

  @ApiProperty({
    example: '2023-10-26T12:55:21.448Z',
    description: 'DateTime created',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-10-26T12:55:21.448Z',
    description: 'DateTime updated',
  })
  updatedAt: string;

  @ApiProperty({ example: 'some_password_1', description: 'email confirmed' })
  emailConfirmed: boolean;
}
