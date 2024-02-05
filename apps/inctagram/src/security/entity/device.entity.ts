import { ApiProperty } from '@nestjs/swagger';

export class DeviceEntity {
  /**
   * File title
   * @example leave-2004.jpg
   */
  @ApiProperty({
    example: '32asdf67-283b-16d7-a546-4266as4400fe',
    description: 'id',
  })
  id: string;

  @ApiProperty({ example: 'Phone', description: 'title' })
  title: string;

  @ApiProperty({ example: '222.222.333.2:8000', description: 'ip' })
  ip: string;

  @ApiProperty({
    example: '2023-10-26T12:55:21.448Z',
    description: 'DateTime created',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-10-26T12:55:21.448Z',
    description: 'DateTime lastActiveDate',
  })
  lastActiveDate: string;
}

export const deviceSelect = {
  id: true,
  lastActiveDate: true,
  createdAt: true,
  ip: true,
  title: true,
};

export const deviceExample = {
  id: '32asdf67-283b-16d7-a546-4266as4400fe',
  lastActiveDate: '2023-10-26T12:55:21.448Z',
  createdAt: '2023-10-26T12:55:21.448Z',
  ip: '222.333.1.14:8000',
  title: 'Some phone',
};
