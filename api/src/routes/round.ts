import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";

export class RoundRouting extends Routing {
    private static includes: Prisma.RoundInclude = {
        buildings: {
            include: {
                building: selectBuilding(),
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.round.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                name: req.query["name"],
            },
            include: RoundRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.round.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: RoundRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const round = await prisma.round.create({
            data: req.body,
        });

        return res.status(201).json(round);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.round.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.round.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }
}
