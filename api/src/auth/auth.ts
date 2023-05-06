import express from "express";
import {APIError} from "../errors/api_error";
import {APIErrorCode} from "../errors/api_error_code";
import {Parser} from "../parser";
import {CustomRequest} from "../routes/routing";
import {Console} from "inspector";

export class Auth {
    static authorization(options: {
        superStudent?: boolean;
        student?: boolean;
        syndicus?: boolean;
    }): MethodDecorator {
        return function (
            target: object,
            propertyKey: string | symbol,
            descriptor: PropertyDescriptor,
        ) {
            const original = descriptor.value;

            descriptor.value = function (
                req: CustomRequest,
                res: express.Response,
            ) {
                if (process.env.DISABLE_AUTH === "true") {
                    return original.apply(this, [req, res]);
                }

                // Administrators are authorized to do and see anything
                if (req.user?.admin) {
                    return original.apply(this, [req, res]);
                }

                // User is not an admin, so if they want to see deleted data,
                // they are either returned a Forbidden error or Unauthorized.
                if (Parser.bool(req.query["deleted"], false)) {
                    if (req.user !== null) {
                        throw new APIError(APIErrorCode.FORBIDDEN);
                    } else {
                        throw new APIError(APIErrorCode.UNAUTHORIZED);
                    }
                }

                // Only admins and super students are allowed to issue hard
                // deletes.
                if (Parser.bool(req.body["hardDelete"], false)) {
                    if (!req.user?.admin && !req.user?.super_student) {
                        throw new APIError(APIErrorCode.FORBIDDEN);
                    } else if (req.user == null) {
                        throw new APIError(APIErrorCode.UNAUTHORIZED);
                    }
                }

                // Check for super student privileges
                if (
                    options.superStudent &&
                    !req.user?.super_student &&
                    !options.syndicus
                ) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                console.log("test: " + !options.superStudent + ", " + !req.user?.student + ", " + !req.user?.syndicus.length);
                // Check for authorization limits of superstudent
                if (
                    !options.superStudent &&
                    !req.user?.student &&
                    !req.user?.syndicus.length
                ) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                // Check for student privileges
                if (
                    options.student &&
                    !req.user?.student &&
                    !req.user?.super_student &&
                    !options.syndicus
                ) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                // Check for syndicus privileges
                if (options.syndicus && !req.user?.syndicus.length) {
                    throw new APIError(APIErrorCode.FORBIDDEN);
                }

                return original.apply(this, [req, res]);
            };
        };
    }
}
