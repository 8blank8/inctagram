import { CustomError } from "./custom-error";

export class Result<T = void> {

    private constructor(
        private readonly _isSuccess: boolean,
        private readonly _value?: T,
        private readonly _error?: CustomError,
    ) {
    }

    public static Ok<T>(value?: T): Result<T> {
        let parsedValue: any = true;

        if (Boolean(value) || Number(value) === 0) parsedValue = value;

        return new Result<T>(true, parsedValue as unknown as T);
    }

    public static Err<T>(err: CustomError | string): Result<T> {

        let error: CustomError = err as CustomError;

        if (typeof err === 'string')
            error = new CustomError(err as string);

        return new Result<T>(false, null, error);
    }

    get value(): T {
        if (!this._value && Number(this._value) !== 0) throw new Error('Does not extract value from Result');
        return this._value;
    }

    get err(): CustomError {
        if (!this._error) throw new Error('Does not extract error from Result');
        return this._error;
    }

    get isSuccess(): boolean {
        return this._isSuccess;
    }
}
