import express from "express";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class Auth {
    static authorization(options: {
        superStudent?: boolean;
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

                // Administrators are authorized to do and see anything
                if (req.user?.admin) {
                    return original.apply(this, [req, res]);
                }

                // Check for super student privileges
                if (options.superStudent && !req.user?.super_student) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                // Check for student privileges
                if (options.student && !req.user?.student) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                return original.apply(this, [req, res]);
            };
        };
    }
}
