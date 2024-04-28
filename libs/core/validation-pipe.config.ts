import { BadRequestException, ValidationError, ValidationPipeOptions } from "@nestjs/common";

export const validationPipeConfig: ValidationPipeOptions = {
    transform: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
    exceptionFactory: (errors: ValidationError[]) => {
        const errorsMessages = errors.map(e => {
            let message = null;

            if (e.constraints && Object.keys(e.constraints).length) {
                message = e.constraints[Object.keys(e.constraints)[0]]
            }

            return {
                field: e.property,
                message
            }
        })

        throw new BadRequestException(errorsMessages)
    }
}
