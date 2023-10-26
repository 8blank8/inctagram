import { CreateUserDto } from 'apps/inctagram/src/user/dto/create.user.dto';

export const getTestUser = (number: number): CreateUserDto => {
  return {
    username: `firstName${number}`,
    password: `password${number}`,
    email: `example${number}@mail.com`,
  };
};

export const testUsers = [0, 1, 2, 3].map((i) => getTestUser(i));
