import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationErrorInterface } from '../http/errors/interfaces/validation-error.interface';
import { ErrorResponseInterface } from '../http/errors/interfaces/error-response.interface';
import { ErrorCode } from '../http/errors/enum/error-code.enum';

export class ValidationException extends HttpException {
    constructor(entryErrors: ValidationError[] | string) {
        const errors = Array.isArray(entryErrors)
            ? ValidationException.transformErrors(entryErrors)
            : entryErrors;

        super(ValidationException.wrapResponse(errors), 200);
    }

    static wrapResponse(
        errors: ValidationErrorInterface[] | string,
    ): ErrorResponseInterface {
        return {
            error: {
                code: ErrorCode.VALIDATION,
                data: errors,
            },
        };
    }

    static transformErrors(
        errors: ValidationError[],
    ): ValidationErrorInterface[] {
        return errors.map((error) => ({
            properties: error.property,
            errors: error.constraints,
            nested: this.transformErrors(error.children),
        }));
    }
}
