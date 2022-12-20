import { ErrorCode } from 'src/http/errors/enum/error-code.enum';
import ApiError from '../../../http/errors/api.error';

export default class LoginFailedError extends ApiError {
    getCode(): ErrorCode {
        return ErrorCode.LOGIN_FAILED;
    }
    protected getDefaultMessage(): string {
        return 'Неверный логин или пароль';
    }
}
