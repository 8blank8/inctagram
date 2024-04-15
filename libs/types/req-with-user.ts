import { GoogleUserOauthType } from "@libs/guards/google.guard"
import { Request } from "express"

export type ReqWithUser = Request & { userId: string, deviceId: string }

export type ReqWithGoogleUser = Request & { user: GoogleUserOauthType }