import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  /**
   * The name of the User
   * @example John
   */
  @ApiProperty({
    example: '32asdf67-283b-16d7-a546-4266as4400fe',
    description: 'User id',
  })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'username, required' })
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

  @ApiProperty({ example: true, description: 'email confirmed' })
  emailConfirmed: boolean;
}

export const userSelect = {
  id: true,
  username: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  emailConfirmed: true,
};
