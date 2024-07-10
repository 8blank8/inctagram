import { ResultCode } from "@libs/interceptor/custom-response";

export class CustomError {
    constructor(
        public readonly message: string,
        public readonly code?: number,
    ) { }
}

export const AUTH_ERROR_CODE = 401;

export class AuthError extends CustomError {
    constructor(msg: string) {
        super(
            msg,
            AUTH_ERROR_CODE
        )
    }
}

export const INTERNAL_SERVER_ERROR_CODE = 500;

export class InternalServerError extends CustomError {
    constructor(msg: string) {
        super(
            msg,
            INTERNAL_SERVER_ERROR_CODE
        )
    }
}

export const NOT_FOUND_ERROR_CODE = 404;

export class NotFoundError extends CustomError {
    constructor(entityName: string, by: string, value: number | string) {
        super(
            `${entityName} ${by}:${value} not found`,
            NOT_FOUND_ERROR_CODE
        )
    }
}

export const DUPLICATE_ERROR_CODE = 410;

export class DuplicateError extends CustomError {
    constructor(duplicateField: string, value: number | string) {
        super(
            `${duplicateField} ${value} already exists`,
            DUPLICATE_ERROR_CODE
        )
    }
}

export class SomeError extends CustomError {
    constructor(text: string) {
        super(
            text,
            ResultCode.SOME_ERROR
        )
    }
}


export class ExpiresConfirmationCodeError extends CustomError {
    constructor(email: string) {
        super(
            `${email}`,
            ResultCode.EXPIRES_CONFIRMATION_CODE
        )
    }
}

export class UserWithEmailIsExistError extends CustomError {
    constructor(email: string) {
        super(
            email,
            ResultCode.USER_WITH_EMAIL_IS_EXIST
        )
    }
}

export class UserWithUsernameIsExistError extends CustomError {
    constructor(username: string) {
        super(
            username,
            ResultCode.USER_WITH_EMAIL_IS_EXIST
        )
    }
}

export class UserWithIdNotFoundError extends CustomError {
    constructor(id: string) {
        super(
            `user with id: ${id} not found`,
            ResultCode.USER_WITH_ID_NOT_FOUND
        )
    }
}

export class UserWithEmailNotFoundError extends CustomError {
    constructor(email: string) {
        super(
            `user with email: ${email} not found`,
            ResultCode.USER_WITH_ID_NOT_FOUND
        )
    }
}

export class EmailIsConfirmedError extends CustomError {
    constructor() {
        super(
            'user email is confirmed',
            ResultCode.EMAIL_IS_CONFIRMED
        )
    }
}

export class UserNotFoundError extends CustomError {
    constructor() {
        super(
            `user not found`,
            ResultCode.USER_NOT_FOUND
        )
    }
}

export class BadCredentialsError extends CustomError {
    constructor() {
        super(
            `inccorect email or password`,
            ResultCode.BAD_CREDENTIALS
        )
    }
}

export class EmailNotConfirmedError extends CustomError {
    constructor() {
        super(
            'email not confirmed',
            ResultCode.EMAIL_NOT_CONFIRMED
        )
    }
}

export class DeviceNotFoundError extends CustomError {
    constructor() {
        super(
            'device not found',
            ResultCode.DEVICE_NOT_FOUND
        )
    }
}

export class NotOwnerError extends CustomError {
    constructor(text: string) {
        super(
            `user not owner this ${text}`,
            ResultCode.NOT_OWNER
        )
    }
}

export class UserIsOver13Error extends CustomError {
    constructor() {
        super(
            'A user under 13 cannot create a profile',
            ResultCode.USER_IS_OVER_13
        )
    }
}

export class PostNotFoundError extends CustomError {
    constructor() {
        super(
            'post not found',
            ResultCode.POST_NOT_FOUND
        )
    }
}

export class AvatarNotDeletedError extends CustomError {
    constructor() {
        super(
            'avatar is not deleted',
            ResultCode.AVATAR_NOT_DELETED
        )
    }
}

export class AvatarNotFoundError extends CustomError {
    constructor(id: string) {
        super(
            `avatar with id: ${id} not found`,
            ResultCode.AVATAR_NOT_FOUND
        )
    }
}