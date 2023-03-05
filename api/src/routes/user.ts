import { prisma } from "../prisma";
import express from "express";
import { Routing } from "./routing";
import { APIErrorCode } from "../errors/api_error_code";
import { APIError } from "../errors/api_error";

const DEFAULT_PAGE_SIZE = 1024;

export class UserRouting extends Routing {
    async getAll(req: express.Request, res: express.Response) {
        if (!req.user?.super_student && !req.user?.admin) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const limit = Number(req.query["limit"] ?? DEFAULT_PAGE_SIZE);
        const offset = Number(req.query["offset"] ?? 0);
        const student =
            req.query["student"] == "true"
                ? true
                : req.query["student"] == "false"
                ? false
                : undefined;
        const superStudent =
            req.query["super_student"] == "true"
                ? true
                : req.query["super_student"] == "false"
                ? false
                : undefined;
        const admin =
            req.query["admin"] == "true"
                ? true
                : req.query["admin"] == "false"
                ? false
                : undefined;

        if (Number.isNaN(limit) || Number.isNaN(offset)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        const result = await prisma.user.findMany({
            take: limit,
            skip: offset,
            where: {
                student: student,
                super_student: superStudent,
                admin: admin,
            },
            include: {
                address: true,
                regions: true,
                schedule: true,
            },
        });

        return res.json(result);
    }

    async getOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        if (id !== req.user?.id || !req.user.super_student || !req.user.admin) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const result = await prisma.user.findFirst({
            where: {
                id: id,
            },
            include: {
                address: true,
                regions: true,
                schedule: true,
            },
        });

        return res.json(result);
    }

    async createOne(req: express.Request, res: express.Response) {
        if (!req.user?.super_student || !req.user?.admin) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const user = await prisma.user.create({
            data: req.body,
        });

        return res.status(201).json(user);
    }

    async updateOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Bad Request" });
        }

        if (
            id !== req.user?.id &&
            !req.user?.super_student &&
            !req.user?.admin
        ) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const result = await prisma.user.update({
            data: req.body,
            where: {
                id: id,
            },
        });

        return res.status(200).json(result);
    }

    async deleteOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).send("Invalid Request");
        }

        if (
            id !== req.user?.id &&
            !req.user?.super_student &&
            !req.user?.admin
        ) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        // TODO: delete cascade in the database!
        await prisma.userRegion.deleteMany({
            where: {
                user_id: id,
            },
        });

        const result = await prisma.user.delete({
            where: {
                id: id,
            },
        });

        return res.status(200).json(result);
    }
}
