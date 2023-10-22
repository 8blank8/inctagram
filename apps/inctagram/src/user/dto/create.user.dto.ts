import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * The name of the Cat
   * @example Kitty
   */
  @ApiProperty({ example: 'John Doe', description: 'User name, optional' })
  name?: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;

  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  password: string;
}
