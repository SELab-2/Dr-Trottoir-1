import { CustomRequest, includeUser, Routing } from "./routing";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Auth } from "../auth/auth";
import { Prisma } from "@selab-2/groep-1-orm";
import RegionInclude = Prisma.RegionInclude;

export class RegionRouting extends Routing {
    private static includes: RegionInclude = {
        users: {
            include: {
                user: includeUser(false),
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                id: Parser.number(req.query["id"]),
                name: Parser.string(req.query["name"]),
                // vind alle regios waar een bepaalde user is toegekend
                users: {
                    some: {
                        user_id: Parser.number(req.query["user_id"]),
                    },
                },
            },
            include: RegionRouting.includes,
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: RegionRouting.includes,
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.create({
            data: req.body,
            include: RegionRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.update({
            data: {
                name: req.body["name"],
            },
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: RegionRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.region.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }
}
