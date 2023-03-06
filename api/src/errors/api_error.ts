import { APIErrorCode } from "./api_error_code";

/**
 * Simple extensions of the Error class which holds a `code` field which refers
 * to the type of HTTP error the object corresponds to.
 *
 * Example usage: `new APIError(APIErrorCode.NOT_FOUND);`
 */
export class APIError extends Error {
    code = APIErrorCode.INTERNAL_SERVER_ERROR;

    constructor(code: APIErrorCode) {
        super();
        this.code = code;

        // By setting the prototype manually, we can use the `instanceof`
        // keyword
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
