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
