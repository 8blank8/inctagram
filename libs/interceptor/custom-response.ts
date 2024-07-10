import { ApiProperty } from "@nestjs/swagger";
import { Result } from "../core/result";

export enum ResultCode {
    SUCCESS = 0,
    ERROR = 1,
    SOME_ERROR = 2,
    EXPIRES_CONFIRMATION_CODE = 3,
    USER_WITH_EMAIL_IS_EXIST = 4,
    USER_WITH_USERNAME_IS_EXIST = 5,
    USER_WITH_ID_NOT_FOUND = 6,
    USER_WITH_EMAIL_NOT_FOUND = 7,
    EMAIL_IS_CONFIRMED = 8,
    USER_NOT_FOUND = 9,
    BAD_CREDENTIALS = 10,
    EMAIL_NOT_CONFIRMED = 11,
    DEVICE_NOT_FOUND = 12,
    NOT_OWNER = 13,
    USER_IS_OVER_13 = 14,
    POST_NOT_FOUND = 15,
    AVATAR_NOT_DELETED = 16,
    AVATAR_NOT_FOUND = 17,
}

class ClientErrorType {
    @ApiProperty()
    message: string;
    @ApiProperty()
    code?: number;
    @ApiProperty()
    field?: string;
}

export class CustomResponseType<T> {
    @ApiProperty()
    resultCode: ResultCode;
    @ApiProperty()
    data: T;
    @ApiProperty()
    errors: ClientErrorType[];
}

export class CustomResponse<T = {}> {
    private constructor(
        private resultCode: ResultCode,
        private data: T,
        private errors: ClientErrorType[]
    ) { }

    public static Ok<T>(
        data: T,
        errors: ClientErrorType[] = [],
        code?: ResultCode
    ): CustomResponse<T> {
        return new CustomResponse(code ? code : ResultCode.SUCCESS, data, errors);
    }

    public static Err<T>(errors: ClientErrorType[], code?: ResultCode): CustomResponse<T> {
        return new CustomResponse(code ? code : ResultCode.ERROR, null, errors);
    }

    public static fromResult<T>(result: Result<T>): CustomResponse<T> {
        return result.isSuccess
            ? CustomResponse.Ok<T>(result.value, [])
            : CustomResponse.Err<T>(result?.err?.message ? [{ message: result.err.message }] : [], result.err.code);
    }
}
