import ApiError from '../http/errors/api.error';
import UnknownError from '../http/errors/unknown.error';
import { HttpException, HttpStatus } from '@nestjs/common';

export default abstract class ApiException extends HttpException {
    private readonly apiError: ApiError;

    constructor(error: ApiError | null = null, statusCode: HttpStatus = 200) {
        const apiError = error ?? new UnknownError();
        super(apiError.getMessage(), statusCode);
        this.apiError = apiError;
    }

    public getApiError(): ApiError {
        return this.apiError;
    }
}
