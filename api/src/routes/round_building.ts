import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";

export class RoundBuildingRouting extends Routing {
    private static includes: Prisma.RoundBuildingInclude = {
        round: true,
        building: selectBuilding(),
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.roundBuilding.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                round_id: Parser.number(req.query["round_id"]),
                building_id: Parser.number(req.query["building_id"]),
                round: {
                    name: req.query["round"],
                },
                building: {
                    name: req.query["building"],
                    ivago_id: req.query["ivago_id"],
                },
            },
            include: RoundBuildingRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.roundBuilding.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: RoundBuildingRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.roundBuilding.create({
            data: req.body,
            include: RoundBuildingRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.roundBuilding.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: RoundBuildingRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.roundBuilding.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            await prisma.roundBuilding.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        }

        return res.status(200).json({});
    }
}
