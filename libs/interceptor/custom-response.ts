import { ApiProperty } from "@nestjs/swagger";
import { Result } from "../core/result";

export enum ResultCode {
    SUCCESS = 0,
    ERROR = 1,
    EXPIRES_CONFIRMATION_CODE = 3
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
            ? CustomResponse.Ok<T>(result.value, null, result.err.code)
            : CustomResponse.Err<T>([{ message: result.err.message }], result.err.code);
    }
}
