import { prisma } from "../prisma";
import express from "express";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class Auth {
    static async authentication(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
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

    static authorization(options: {
        superStudent?: boolean;
        admin?: boolean;
        student?: boolean;
    }): MethodDecorator {
        return function (
            target: object,
            propertyKey: string | symbol,
            descriptor: PropertyDescriptor,
        ) {
            const original = descriptor.value;
            descriptor.value = function (
                req: express.Request,
                res: express.Response,
            ) {
                // Check for admin privileges
                if (options.admin && !req.user?.admin) {
                    throw new APIError(APIErrorCode.UNAUTHORIZED);
                }

                // Check for super student privileges
                if (options.superStudent && !req.user?.super_student) {
                    throw new APIError(APIErrorCode.UNAUTHORIZED);
                }

                // Check for student privileges
                if (options.student && !req.user?.student) {
                    throw new APIError(APIErrorCode.UNAUTHORIZED);
                }

                return original.apply(this, [req, res]);
            };
        };
    }
}
