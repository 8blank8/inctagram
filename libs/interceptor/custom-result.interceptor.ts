import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Result } from "../core/result";
import { Observable, map } from "rxjs";
import { CustomResponse } from "./custom-response";

@Injectable()
export class CustomResultInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(map((result) => {
                if (result instanceof Result) {

                    return CustomResponse.fromResult(result)

                } else {
                    return result;
                }

            }));
    }
}
