export interface GoogleUserData {
  username: string;
  login: string;
  providerId: string;
  avatarUrl: string;
  displayName: string;
  givenName: string;
  familyName: string;
  email: string;
}

export class RegisterGoogleUserCommand {
  public data: GoogleUserData;
}
