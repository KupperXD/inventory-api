import { ErrorInterface } from '../http/errors/interfaces/error.interface';
import { ValidationError } from 'class-validator';

class ErrorHelper {
    static mapError(error: ValidationError): ErrorInterface {
        return {
            properties: [error.property],
            errors: error.constraints,
            nested: error.children.map(ErrorHelper.mapError),
        };
    }
}

export default ErrorHelper;
