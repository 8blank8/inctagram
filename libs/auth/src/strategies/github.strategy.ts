import { GitUserData } from '@app/main/auth/use_cases/github/dto/register-github-user.command';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';

interface GitProfile extends Profile {
  email: string;
  id: string;
  displayName: string;
  username: string;
  emails: { value: string; type?: string }[];
  avatar_url: string;
  _json: { [key: string]: string };
}
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') ?? 'GH_ID',
      clientSecret:
        configService.get<string>('GITHUB_CLIENT_SECRET') ?? 'GH_SECRET',
      callbackURL: `http://localhost:3000/api/v1/auth/callback/github`,
      scope: ['public_profile', 'user:email'],
      profileFields: [
        'email',
        'id',
        'displayName',
        'username',
        'emails',
        'avatar_url',
      ],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GitProfile,
  ) {
    const { _json, username, id, displayName } = profile;
    const user: GitUserData = {
      username,
      login: _json?.login ?? username,
      providerId: id,
      avatarUrl: _json?.avatar_url,
      displayName: displayName ?? '',
      email: _json.email,
    };
    return user;
  }
}
