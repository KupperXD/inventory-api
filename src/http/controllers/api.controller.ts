export default abstract class ApiController {
    protected wrapResponse<T>(response: T): ResponseInterface<T> {
        return {
            response: response,
        };
    }
}
