import { ErrorCode } from './enum/error-code.enum';

export default abstract class ApiError {
    protected message: string;

    constructor(message: string | null = null) {
        this.message = message ?? this.getDefaultMessage();
    }

    abstract getCode(): ErrorCode;

    public getMessage(): string {
        return this.message;
    }

    protected abstract getDefaultMessage(): string;
}
