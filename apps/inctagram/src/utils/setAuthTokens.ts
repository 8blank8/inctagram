import { Response } from 'express';
import { TokenEntity } from '@app/main/auth/entity/token.entity';

export const setAuthTokens = (res: Response, token: TokenEntity) => {
  res
    .cookie('access-token', token.accessToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
};
