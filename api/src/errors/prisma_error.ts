import {Prisma} from "@selab-2/groep-1-orm";
import {APIErrorCode} from "./api_error_code";

/**
 * Returns an object which describes the returned error containing:
 * {
 *     code: the corresponding APIErrorCode,
 *     detail: a short description of the issue,
 * }
 */
export function errorMessagePrismaClient(
    err: Prisma.PrismaClientKnownRequestError,
): { code: APIErrorCode; detail: string } {
    switch (err.code) {
        case "P2002":
            return {
                code: APIErrorCode.CONFLICT,
                detail: "Unique constraint failed",
            };
        case "P2003":
            return {
                code: APIErrorCode.BAD_REQUEST,
                detail: "Foreign key constraint failed",
            }
        case "P2025":
            return {
                code: APIErrorCode.NOT_FOUND,
                detail: "Resource does not exist",
            };
        default:
            return {
                code: APIErrorCode.INTERNAL_SERVER_ERROR,
                detail: "An unknown error occurred",
            };
    }
}
