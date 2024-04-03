import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetEmailCommand {
  @ApiProperty({ example: 'asd.some@asd.com', description: 'User e-mail' })
  email: string;
}
