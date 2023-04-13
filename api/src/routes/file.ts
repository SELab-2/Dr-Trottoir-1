import express from "express";
import { Parser } from "../parser";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import { prisma } from "../prisma";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

const router = express.Router();

//create multer object (get request will download the file)
//(multer saves files to direcotry files, with random name)
// const fileUpload = multer({
//     dest: 'files',
// });

//creates multer object (get request will show file in browser)
//(multer saves files to directory files, with the original name)
const fileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (process.env.LOCAL_FILE_PATH !== undefined) {
                cb(null, process.env.LOCAL_FILE_PATH as string);
            } else {
                cb(null, "files");
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

//Auth for a post request: only admin and super_student can make post request
const isAuthPost = (req: Request, res: Response, next: NextFunction) => {
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
};

// file upload route (single file: .single(),multiple file: .array() )
//Multer saves files whose name attribute is file to directory given in fileUpload
router.post(
    "/",
    isAuthPost,
    fileUpload.single("file"),
    async (req: Request, res: Response) => {
        try {
            // save the file to the database using Prisma
            const result = await prisma.file.create({
                data: req.body,
            });
            // return the saved file as JSON
            res.json(result);
        } catch (err) {
            throw new APIError(APIErrorCode.FAILED_TO_SAVE_FILE);
        }
    },
);

//Auth for get request: you have to be a user to make a get request
const isAuthGet = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (process.env.DISABLE_AUTH !== undefined && process.env.DISABLE_AUTH) {
        console.log(
            process.env.DISABLE_AUTH !== undefined && process.env.DISABLE_AUTH,
        );
        console.log("disable auth: " + process.env.DISABLE_AUTH);
        next();
    } else {
        throw new APIError(APIErrorCode.UNAUTHORIZED);
    }
};

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
            // Send the file to the client
            const dirname = path.resolve();
            const full_path = path.join(dirname, result.path);
            res.sendFile(full_path);
        } catch (err) {
            throw new APIError(APIErrorCode.FAILED_TO_RETRIEVE_FILE);
        }
    },
);

export { router as FileRouter };
