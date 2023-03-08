import express from "express";
import passport from "passport";
import { CustomRequest } from "./routing";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

/**
 * `The AuthRouting class will implement all facilities to login, signup, and
 * sign-out.
 */
export class AuthRouting {
    toRouter(): express.Router {
        const router = express.Router();

        /**
         * Return the current user.
         */
        router.get("/", (req: CustomRequest, res: express.Response) => {
            if (req.user) {
                return res.status(200).json(req.user);
            } else {
                throw new APIError(APIErrorCode.UNAUTHORIZED);
            }
        });

        /**
         * Attempt to log in. The required body is:
         * { username: email, password: password }
         */
        router.post(
            "/login",
            passport.authenticate("local", {
                session: true,
                authInfo: true,
                successRedirect: "/auth",
            }),
        );

        return router;
    }
}
