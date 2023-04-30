import { NextFunction, Request, Response } from "express";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "./api_error";
import { APIErrorCode, errorMessage } from "./api_error_code";
import { errorMessagePrismaClient } from "./prisma_error";

/**
 * The ErrorHandler class contains a static method which will handle any thrown
 * errors in any previous part of the API stack. It parses the error and returns
 * a JSON object with the appropriate HTTP message in the `message` field, and a
 * `detail` field when possible which contains more info. For example: "unique
 * constraint not met" when POSTing new data.
 */
export class ErrorHandler {
    static handle(err: Error, req: Request, res: Response, next: NextFunction) {
        if (process.env.ERROR_LOGGER === "true") {
            console.error(err);
        }

        // If a PrismaORM error occurs, we send a more detailed message.
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const { code, detail } = errorMessagePrismaClient(err);
            return res.status(code.valueOf()).json({
                message: errorMessage(code),
                detail: detail,
            });
        }

        // The Prisma query was invalid. This may happen for a variety of
        // reasons, such as invalid sorting parameters.
        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(APIErrorCode.BAD_REQUEST).json({
                message: errorMessage(APIErrorCode.BAD_REQUEST),
            });
        }

        // Whenever an HTTP error occurs, such as "Not Found" or "Unauthorized".
        if (err instanceof APIError) {
            return res.status(err.code.valueOf()).json({
                message: errorMessage(err.code),
            });
        }

        // Default to "500: Internal Server Error" if required.
        return res.status(500).send({
            message: "Internal Server Error",
        });
    }
}
