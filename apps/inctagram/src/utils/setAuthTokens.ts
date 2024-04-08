import { Response } from 'express';
import { TokenEntity } from '@app/main/auth/entity/token.entity';

export const setAuthTokens = (res: Response, refreshToken: string) => {
  // TODO: on login transfer tokens in cookies
  res
    .cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
    });
};
