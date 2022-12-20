import ApiError from './api.error';
import { ErrorCode } from './enum/error-code.enum';

export default class EntityNotFoundError extends ApiError {
    getCode(): ErrorCode {
        return ErrorCode.ENTITY_NOT_FOUND;
    }
    getDefaultMessage(): string {
        return 'Сущность не найдена';
    }
}
