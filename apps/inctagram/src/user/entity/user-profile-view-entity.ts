import { ApiProperty } from '@nestjs/swagger';

export class UserProfileViewEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426655440000',
    description: 'profile id',
  })
  id: string;

  @ApiProperty({
    example: '32asdf67-283b-16d7-a546-4266as4400fe',
    description: 'user id',
  })
  userId: string;

  @ApiProperty({ example: 'Jonh', description: 'user firstname' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'user lastname' })
  familyName: string;

  @ApiProperty({ example: '12.12.1999', description: 'user date of birth' })
  dateOfBirth: string;

  @ApiProperty({ example: 'about me any text', description: 'user about me' })
  aboutMe: string;

  @ApiProperty({
    example: [{ url: 'http://photo.ru' }],
    description: 'user photo',
  })
  photos: Array<{ url: string }> | null;
}
