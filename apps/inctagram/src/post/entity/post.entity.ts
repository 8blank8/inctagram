import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  /**
   * The name of the Post
   * @example Post
   */
  @ApiProperty({ example: 'asdw1asdw2dad2m', description: 'Post id' })
  id: string;

  @ApiProperty({ example: 'asdw1asdw2dad2m', description: 'User id' })
  authorId: string;

  @ApiProperty({ example: 'Title', description: 'Title, required' })
  title: string;

  @ApiProperty({ example: 'some content', description: 'optional' })
  content: string;

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

  @ApiProperty({ description: 'is Draft' })
  published: boolean;
}
