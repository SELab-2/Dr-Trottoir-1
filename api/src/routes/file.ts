import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from "multer";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import fs from "fs";
import path from "path";

export class FileRouting extends Routing {
    private upload = multer({
        dest: process.env.FILE_STORAGE_DIRECTORY,
        limits: {
            files: 1,
            fileSize: 5 * 1024 * 1024, // 5 MB
        },
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

        switch (result.location) {
            case "FILE_SERVER":
                return res.sendFile(
                    `${path.resolve()}/${process.env.FILE_STORAGE_DIRECTORY}/${
                        result.path
                    }`,
                );
            case "EXTERNAL":
                return res.redirect(result.path);
            default:
                throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Auth.authorization({ student: true })
    async createOne(req: CustomRequest, res: express.Response) {
        if (!req.files || req.files.length !== 1) {
            throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
        }

        const file = (req.files as Express.Multer.File[])[0];
        const result = await prisma.file.create({
            data: {
                path: file.filename,
                mime: file.mimetype,
                size_in_bytes: file.size,
                original_name: file.originalname,
                user_id: req.user?.id ?? 1,
                location: "FILE_SERVER",
            },
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.file.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        if (result.location === "FILE_SERVER") {
            fs.unlinkSync(
                `${process.env.FILE_STORAGE_DIRECTORY}/${result.path}`,
            );
        }

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
        router.patch("/:id", validator.updateOneValidator(), this.updateOne)
        return router;
    }
}
