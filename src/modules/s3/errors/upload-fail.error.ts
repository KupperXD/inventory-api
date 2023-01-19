import ApiError from '../../../http/errors/api.error';
import { ErrorCode } from '../../../http/errors/enum/error-code.enum';

export default class S3UploadFail extends ApiError {
    getCode(): ErrorCode {
        return ErrorCode.S3_UPLOAD_FAIL;
    }
    getDefaultMessage(): string {
        return 'Ошибка загрузки файла в s3';
    }
}
