import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from "multer";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import path from "path";
import fs from "fs";

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

export class FileRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getOne(req: CustomRequest, res: express.Response) {
        // Look up the file in the database using Prisma
        const result = await prisma.file.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        if (result.location === "FILE_SERVER") {
            // Send the file to the client
            const dirname = path.resolve();
            const full_path = path.join(dirname, result.path);
            res.json(result).sendFile(full_path);
        } else if (result.location === "EXTERNAL") {
            // Redirect the client to the external link
            res.json(result).redirect(result.path);
        } else {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const uploadSingle = fileUpload.single("file");
        uploadSingle(req, res, (err) => {
            if (err) {
                throw new APIError(APIErrorCode.BAD_REQUEST);
            }
        });
        delete req.body["file"];
        // save the file to the database using Prisma
        const result = await prisma.file.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        // Look up the file in the database using Prisma
        const result = await prisma.file.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        // Delete the file on the file server
        if (result.location === "FILE_SERVER") {
            const dirname = path.resolve();
            const full_path = path.join(dirname, result.path);
            fs.unlink(full_path, (err) => {
                if (err) {
                    throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
                }
            });
        }
        // Delete the file record from the database using Prisma
        await prisma.file.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });
        return res.status(200).json({});
    }
}
