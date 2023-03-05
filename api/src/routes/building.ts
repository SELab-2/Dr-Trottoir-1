import {prisma} from "../prisma";
import express from "express";
import {Prisma} from "@prisma/client";
import {Routing} from "./abstract";

const DEFAULT_PAGE_SIZE = 1024;

export class BuildingRouting extends Routing {
    async getAll(req: express.Request, res: express.Response) {
        const limit = Number(req.query['limit'] ?? DEFAULT_PAGE_SIZE);
        const offset = Number(req.query['offset'] ?? 0);

        if (Number.isNaN(limit) || Number.isNaN(offset)) {
            return res.status(400).json({message: "Bad Request"});
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
            return res.status(400).json({message: "Bad Request"});
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
            return res.status(401).json({message: "Unauthorized"});
        }

        const result = await prisma.building.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    async updateOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({message: "Bad Request"});
        }

        if (!req.user?.admin) {
            res.status(403);
            res.send("Unauthorized")
            return;
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
            return res.status(400).send("Invalid Request");
        }

        if (!req.user?.admin) {
            res.status(403);
            res.send("Unauthorized")
            return;
        }

        try {
            const result = await prisma.building.delete({
                where: {
                    id: id
                },
            });

            return res.status(200).json(result);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        return res.status(404).json({message: "Not Found"})
                }
            }

            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}
