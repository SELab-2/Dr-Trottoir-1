import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from "multer";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import fs from "fs";
import { File } from "@selab-2/groep-1-orm";

export class FileRouting extends Routing {
    private storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if (process.env.FILE_STORAGE_DIRECTORY !== undefined) {
                cb(null, process.env.FILE_STORAGE_DIRECTORY);
            } else {
                cb(null, "/tmp");
            }
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
    private upload = multer({
        // dest: process.env.FILE_STORAGE_DIRECTORY,
        limits: {
            files: 1,
            fileSize: 5 * 1024 * 1024, // 5 MB
        },
        storage: this.storage,
    });

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.file.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.file.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.sendFile(
            `${process.env.FILE_STORAGE_DIRECTORY}/${result.path}`,
        );
    }

    @Auth.authorization({ student: true })
    async createOne(req: CustomRequest, res: express.Response) {
        if (!req.files || req.files.length !== 1) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }
        const file = (req.files as Express.Multer.File[])[0];

        const userId = req.user?.id ?? 1;
        const result = await prisma.file.create({
            data: {
                user_id: userId,
                path: file.originalname,
                mime: file.mimetype,
                size_in_bytes: file.size,
                original_name: file.originalname,
            },
        });

        // drop path, as we do not want to expose the internal location
        const ret = { ...result } as Partial<File>;
        delete ret["path"];

        return res.status(201).json(ret);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.file.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        fs.unlinkSync(`${process.env.FILE_STORAGE_DIRECTORY}/${result.path}`);

        return res.status(200).json({});
    }

    async updateOne(req: CustomRequest, res: express.Response) {
        throw new APIError(APIErrorCode.FORBIDDEN);
    }

    toRouter(): express.Router {
        const router = express.Router();
        const validator = this.getValidator();
        router.get("/", validator.getAllValidator(), this.getAll);
        router.get("/:id", validator.getOneValidator(), this.getOne);
        router.post(
            "/",
            validator.createOneValidator(),
            this.upload.any(),
            this.createOne,
        );
        router.delete("/:id", validator.deleteOneValidator(), this.deleteOne);
        router.patch("/:id", validator.updateOneValidator(), this.updateOne);
        return router;
    }
}
