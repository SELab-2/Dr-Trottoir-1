import {prisma} from "../prisma";
import express from "express";
import {Routing} from "./routing";
import {APIError} from "../errors/api_error";
import {APIErrorCode} from "../errors/api_error_code";

const DEFAULT_PAGE_SIZE = 1024;

export class BuildingRouting extends Routing {
    async getAll(req: express.Request, res: express.Response) {
        const limit = Number(req.query['limit'] ?? DEFAULT_PAGE_SIZE);
        const offset = Number(req.query['offset'] ?? 0);

        if (Number.isNaN(limit) || Number.isNaN(offset)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        const result = await prisma.building.findMany({
            take: limit,
            skip: offset,
            include: {
                address: true,
                syndicus: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return res.json(result);
    }

    async getOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        const result = await prisma.building.findFirst({
            where: {
                id: id
            },
            include: {
                address: true,
                syndicus: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return res.json(result);
    }

    async createOne(req: express.Request, res: express.Response) {
        if (!req.user?.admin) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const result = await prisma.building.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    async updateOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        if (!req.user?.admin) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        const result = await prisma.building.update({
            data: req.body,
            where: {
                id: id
            },
        });

        return res.status(200).json(result);
    }

    async deleteOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        if (!req.user?.admin) {
            throw new APIError(APIErrorCode.UNAUTHORIZED);
        }

        const result = await prisma.building.delete({
            where: {
                id: id
            },
        });

        return res.status(200).json(result);
    }
}
