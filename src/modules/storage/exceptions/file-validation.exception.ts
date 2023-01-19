import { ValidationException } from '../../../exceptions/validation.exception';

export class FileValidationException extends ValidationException {
    constructor(error: string) {
        super(error);
    }
}
