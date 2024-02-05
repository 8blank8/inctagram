import { UserEntity, userSelect } from '@app/main/user/entity/user-entity';
import {
  userProfileExample,
  userProfileSelect,
  UserProfileViewEntity,
} from '@app/main/user/entity/user-profile-view.entity';
import { ApiProperty } from '@nestjs/swagger';
import { fileExample } from '@app/main/user/entity/file.entity';

export class FullUserEntity extends UserEntity {
  @ApiProperty({
    example: { ...userProfileExample, photos: [fileExample] },
    description: 'UserProfile',
  })
  userProfile: UserProfileViewEntity;
}

export const selectFullUser = {
  ...userSelect,
  userProfile: { select: userProfileSelect },
};
