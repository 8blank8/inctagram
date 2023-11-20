import { ApiProperty } from '@nestjs/swagger';

export class FileEntity {
  /**
   * File title
   * @example leave-2004.jpg
   */
  @ApiProperty({ example: 'asdw1asdw2dad2m', description: 'File id' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'File name, required' })
  title: string;

  @ApiProperty({ example: 'https://someurl.com', description: 'File url' })
  url: string;

  @ApiProperty({ example: 'asdw1asdw2dad2m', description: 'Author id' })
  authorId: string;

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
}

export const fileSelect = {
  id: true,
  title: true,
  url: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
};

export const fileExample = {
  url: 'http://photo.com',
  id: '32asdf67-283b-16d7-a546-4266as4400fe',
  title: 'vacations-2004.jpg',
  authorId: '32asdf67-283b-16d7-a546-4266as4400fe',
  createdAt: '2023-10-26T12:55:21.448Z',
  updatedAt: '2023-10-26T12:55:21.448Z',
};
