import { UserEntity } from '@app/main/user/entity/user-entity';
import { Request } from 'express';

export type ReqWithUser = Request & { user: UserEntity };
