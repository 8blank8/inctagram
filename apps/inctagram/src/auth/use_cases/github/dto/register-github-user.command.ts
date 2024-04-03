export interface GitUserData {
  username: string;
  login: string;
  providerId: string;
  avatarUrl: string;
  displayName: string;
  email: string;
}

export class RegisterGithubUserCommand {
  public data: GitUserData;
}
