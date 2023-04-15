import express from "express";
import { Parser } from "../parser";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import { prisma } from "../prisma";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

const router = express.Router();

//creates multer object
const fileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (process.env.LOCAL_FILE_PATH !== undefined) {
                cb(null, process.env.LOCAL_FILE_PATH as string);
            } else {
                throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

// file upload route
router.post(
    "/",
    (req: Request, res: Response, next: NextFunction) => {
        const { user } = req;
        if (
            (process.env.DISABLE_AUTH !== undefined &&
                process.env.DISABLE_AUTH == "true") ||
            (user && (user.super_student || user.admin || user.syndicus))
        ) {
            next();
        } else if (user) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        } else {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }
    },
    fileUpload.single("file"),
    async (req: Request, res: Response) => {
        try {
            // save the file to the database using Prisma
            delete req.body["file"];
            const result = await prisma.file.create({
                data: req.body,
            });
            // return the saved file as JSON
            res.json(result);
        } catch (err) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }
    },
);

// file get route
router.get(
    "/:id",
    (req: Request, res: Response, next: NextFunction) => {
        // Check authentication
        const { user } = req;
        if (
            !(
                (process.env.DISABLE_AUTH !== undefined &&
                    process.env.DISABLE_AUTH === "true") ||
                user
            )
        ) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        // Continue if authenticated
        next();
    },
    async (req: Request, res: Response) => {
        try {
            // Look up the file in the database using Prisma
            const result = await prisma.file.findUnique({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });

            if (!result) {
                throw new APIError(APIErrorCode.FILE_NOT_FOUND);
            }
            if (result.location === "FILE_SERVER") {
                // Send the file to the client
                const dirname = path.resolve();
                const full_path = path.join(dirname, result.path);
                res.sendFile(full_path);
            } else if (result.location === "EXTERNAL") {
                // Redirect the client to the external link
                res.redirect(result.path);
            } else {
                throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
            }
        } catch (err) {
            throw new APIError(APIErrorCode.FAILED_TO_RETRIEVE_FILE);
        }
    },
);

export { router as FileRouter };
