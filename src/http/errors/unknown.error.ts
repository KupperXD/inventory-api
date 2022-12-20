import ApiError from './api.error';
import { ErrorCode } from './enum/error-code.enum';

export default class UnknownError extends ApiError {
    getCode(): ErrorCode {
        return ErrorCode.UNKNOWN;
    }
    protected getDefaultMessage(): string {
        return 'Неизвестная ошибка';
    }
}
