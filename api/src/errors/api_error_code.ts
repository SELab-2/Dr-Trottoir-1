/**
 * We define a custom enum which represents the various possible HTTP error
 * codes used throughout this project.
 */
export enum APIErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

/**
 * Retrieve a plain-text message corresponding to the value of an APIErrorCode.
 * @param code An instance of APIErrorCode
 */
export function errorMessage(code: APIErrorCode): string {
    switch (code) {
        case APIErrorCode.BAD_REQUEST:
            return "Bad Request";
        case APIErrorCode.UNAUTHORIZED:
            return "Unauthorized";
        case APIErrorCode.FORBIDDEN:
            return "Forbidden";
        case APIErrorCode.NOT_FOUND:
            return "Not Found";
        case APIErrorCode.CONFLICT:
            return "Conflict";
        case APIErrorCode.METHOD_NOT_ALLOWED:
            return "Method not allowed";
        case APIErrorCode.INTERNAL_SERVER_ERROR:
            return "Internal Server Error";
        default:
            console.error(
                `ERROR: an unknown error message was raised: ${code}`,
            );
            return "Internal Server Error";
    }
}
