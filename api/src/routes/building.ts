import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";

export class BuildingRouting extends Routing {
    // This specific function is used since the syndicus join gets quite ugly
    // otherwise
    static joins(req: CustomRequest): any {
        const joins = Parser.stringArray(req.query.join, []);
        const result: any = {};

        if (joins?.includes("address")) {
            result["address"] = true;
        }

        if (joins?.includes("syndicus")) {
            result["syndicus"] = {
                include: {
                    user: true,
                },
            };
        }

        return result;
    }

    @Auth.authorization({ student: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                name: req.query["name"],
            },
            include: BuildingRouting.joins(req),
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: BuildingRouting.joins(req),
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }
}
