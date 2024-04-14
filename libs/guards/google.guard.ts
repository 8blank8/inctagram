import { config } from 'dotenv'
config()
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

export type GoogleUserOauthType = {
    email: string,
    firstname: string,
    lastname: string,
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALBACK_URL || 'http://localhost:3001/api/v1/auth/google-redirect',
            scope: ['profile', 'email'],
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails } = profile;
        const user: GoogleUserOauthType = {
            email: emails[0].value,
            firstname: name.givenName,
            lastname: name.familyName,
        };

        done(null, user);
    }
}

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
}