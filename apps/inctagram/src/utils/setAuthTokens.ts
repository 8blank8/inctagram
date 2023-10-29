import { Response } from 'express';
import { AuthEntity } from '@app/main/auth/entity/auth.entity';

export const setAuthTokens = (res: Response, token: AuthEntity) => {
  res
    .cookie('access-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
    });
};
