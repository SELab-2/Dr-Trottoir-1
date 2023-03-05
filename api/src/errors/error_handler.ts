import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { APIError } from "./api_error";
import { APIErrorCode } from "./api_error_code";

export class ErrorHandler {
    static handle(err: Error, req: Request, res: Response, next: NextFunction) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case "P2002":
                    return res.status(409).json({
                        message: "Conflict: unique constraint failed",
                    });
                case "P2025":
                    return res.status(404).json({ message: "Not Found" });
            }
        }

        if (err instanceof APIError) {
            switch (err.code) {
                case APIErrorCode.BAD_REQUEST:
                    return res
                        .status(err.code.valueOf())
                        .json({ message: "Bad Request" });
                case APIErrorCode.UNAUTHORIZED:
                    return res
                        .status(err.code.valueOf())
                        .json({ message: "Unauthorized" });
                case APIErrorCode.INTERNAL_SERVER_ERROR:
                    return res
                        .status(err.code.valueOf())
                        .json({ message: "Internal Server Error" });
            }
        }

        return res.status(500).send({ message: "Internal Server Error" });
    }
}
