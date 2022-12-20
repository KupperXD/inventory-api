import { ErrorResponseInterface } from '../errors/interfaces/error-response.interface';
import ApiError from '../errors/api.error';

export default abstract class ApiController {
    protected wrapResponse<T>(response: T): ResponseInterface<T> {
        return {
            response: response,
        };
    }

    protected wrapError(error: ApiError): ErrorResponseInterface {
        return {
            error: {
                code: error.getCode(),
                data: error.getMessage(),
            },
        };
    }
}
