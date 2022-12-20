import { ErrorCode } from '../enum/error-code.enum';
import { ValidationErrorInterface } from './validation-error.interface';

export interface ErrorResponseInterface {
    error: {
        code: ErrorCode;
        data: string | ValidationErrorInterface[];
    };
}
