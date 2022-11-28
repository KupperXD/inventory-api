import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import ErrorHelper from '../../../helpers/error.helper';

export class ValidationException extends BadRequestException {
    constructor(errors: ValidationError[]) {
        super(errors.map(ErrorHelper.mapError), 'Validation failed!');
    }
}
