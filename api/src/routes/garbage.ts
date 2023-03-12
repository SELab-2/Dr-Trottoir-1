import { CustomRequest, Routing } from "./routing";
import express from "express";
import { prisma } from "../prisma";
import { Parser } from "../parser";
import { Auth } from "../auth/auth";

export class GarbageRouting extends Routing {
    @Auth.authorization({ student: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);
        const result = await prisma.garbage.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                pickup_time: {
                    lte: Parser.date(req.query["before"]),
                    gte: Parser.date(req.query["after"]),
                },
            },
            include: {
                action: joins?.includes("action"),
                building: joins?.includes("building"),
            },
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);
        const result = await prisma.garbage.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                action: joins?.includes("action"),
                building: joins?.includes("building"),
            },
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }
}
