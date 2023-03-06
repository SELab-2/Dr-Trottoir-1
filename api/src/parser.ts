import { APIError } from "./errors/api_error";
import { APIErrorCode } from "./errors/api_error_code";

export class Parser {
    static bool(
        input: string | undefined,
        otherwise: boolean | undefined = undefined,
    ): boolean | undefined {
        if (input === "true") {
            return true;
        } else if (input === "false") {
            return false;
        } else if (input) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        } else {
            return otherwise;
        }
    }

    static number(
        input: string | undefined,
        otherwise: number | undefined = undefined,
        required = false,
    ): number | undefined {
        if (input === undefined) {
            if (required) {
                throw new APIError(APIErrorCode.BAD_REQUEST);
            } else {
                return otherwise;
            }
        }

        const result = Number(input);

        if (Number.isNaN(result)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return result;
    }

    static stringArray(
        input: string | undefined,
        otherwise: string[] | undefined = undefined,
    ): string[] | undefined {
        return input?.split(",") ?? otherwise;
    }
}
