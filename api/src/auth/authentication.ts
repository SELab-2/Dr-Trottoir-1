import { prisma } from "../prisma";
import express from "express";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class AuthenticationHandler {
    static async handle(req: express.Request, res: express.Response, next: express.NextFunction) {
        const value = req.header("Authentication");
        const id = parseInt(value ?? "");

        // If no attempt is made to authenticate, simply move forward.
        if (value === undefined) {
            req.user = null;
            next();
        }

        if (Number.isNaN(id)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // If there is an identifier, attempt to retrieve the corresponding user
        req.user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        // We're done!
        next();
    }
}
