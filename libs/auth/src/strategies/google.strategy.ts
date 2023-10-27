import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private commandBus: CommandBus) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_OAUTH_CALLBACK ||
        'https://incubator-icta-trainee.uk/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      username: `${name.givenName}_${name.familyName}`,
      picture: photos[0].value,
    };
    // TODO: create method to apply provider
    console.log(user);
    done(null, user);
  }
}
