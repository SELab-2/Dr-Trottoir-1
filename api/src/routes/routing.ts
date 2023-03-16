import express from "express";
import { APIErrorCode } from "../errors/api_error_code";
import { APIError } from "../errors/api_error";

export type CustomRequest = express.Request<any, any, any, any, any>;

/**
 * The Routing class provides some skeleton code for a basic endpoint. If you
 * wish to implement a new route, simply extend this class and override the
 * required functions.
 *
 * HTTP GET    "/"    => getAll
 * HTTP GET    "/:id" => getOne
 * HTTP POST   "/"    => createOne
 * HTTP PATCH  "/:id" => updateOne
 * HTTP DELETE "/:id" => deleteOne
 *
 * All functions take in an express.Request object and can manipulate an
 * express.Response object. The functions can be asynchronous. New errors can
 * be thrown and will be handled by the error handler.
 *
 * You are free to add any other function and overwrite Routing::toRouter.
 */
export abstract class Routing {
    getAll(req: CustomRequest, res: express.Response): void {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    getOne(req: CustomRequest, res: express.Response): void {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    createOne(req: CustomRequest, res: express.Response): void {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    updateOne(req: CustomRequest, res: express.Response): void {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    deleteOne(req: CustomRequest, res: express.Response): void {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    /**
     * Construct a new router which contains all the mentioned functions.
     */
    toRouter(): express.Router {
        const router = express.Router();
        router.get("/", this.getAll);
        router.get("/:id", this.getOne);
        router.post("/", this.createOne);
        router.patch("/:id", this.updateOne);
        router.delete("/:id", this.deleteOne);
        return router;
    }
}
export function includeUser(
    include: boolean | undefined,
    includeAddress: boolean,
) {
    if (include) {
        return {
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                last_login: true,
                date_added: true,
                phone: true,
                address_id: true,
                address: includeAddress,
                student: true,
                super_student: true,
                admin: true,
                hash: false,
                salt: false,
            },
        };
    }
    return false;
}
