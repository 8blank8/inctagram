import { ApiProperty } from '@nestjs/swagger';
import {
  FileEntity,
  fileExample,
  fileSelect,
} from '@app/main/user/entity/file.entity';

export class UserProfileViewEntity {
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
    example: [fileExample],
    description: 'user photo',
  })
  photos: Array<FileEntity>;
}

export const userProfileSelect = {
  userId: true,
  firstName: true,
  familyName: true,
  dateOfBirth: true,
  aboutMe: true,
  photos: { select: fileSelect },
};

export const userProfileExample = {
  userId: '32asdf67-283b-16d7-a546-4266as4400fe',
  firstName: 'Jonh',
  familyName: 'Doe',
  dateOfBirth: '12.12.1999',
  aboutMe: 'about me any text',
};
