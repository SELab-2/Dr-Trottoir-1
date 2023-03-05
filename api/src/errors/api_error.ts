import {APIErrorCode} from "./api_error_code";

export class APIError extends Error {
    code = APIErrorCode.INTERNAL_SERVER_ERROR

    constructor(code: APIErrorCode) {
        super();
        this.code = code;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
