import express from "express";
import passport from "passport";
import { CustomRequest } from "./routing";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class AuthRouting {
    toRouter(): express.Router {
        const router = express.Router();

        router.get("/", (req: CustomRequest, res: express.Response) => {
            if (req.user) {
                return res.status(200).json(req.user);
            } else {
                throw new APIError(APIErrorCode.UNAUTHORIZED);
            }
        })

        router.post("/login", passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        }))

        return router;
    }
}
