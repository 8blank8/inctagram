import { GoogleUserOauthType } from "@libs/guards/google.guard";


export class CreateUserGoogleOauthCommand implements GoogleUserOauthType {
    email: string;
    firstname: string;
    lastname: string;
    userAgent: string;
}