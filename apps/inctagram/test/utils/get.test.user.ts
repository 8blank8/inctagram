import { CreateUserDto } from 'apps/inctagram/src/user/dto/create.user.dto';

export const getTestUser = (number: number): CreateUserDto => {
  return {
    username: `firstName${number}`,
    password: `password${number}`,
    email: `example${number}@mail.com`,
  };
};
