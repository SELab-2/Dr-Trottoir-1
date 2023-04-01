import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing, includeUser, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";

export class SyndicusRouting extends Routing {
    private static includes: Prisma.SyndicusInclude = {
        user: includeUser(true),
        building: selectBuilding(),
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.syndicus.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                user: {
                    last_login: {
                        lte: Parser.date(req.query["login_before"]),
                        gte: Parser.date(req.query["login_after"]),
                    },
                    date_added: {
                        lte: Parser.date(req.query["added_before"]),
                        gte: Parser.date(req.query["added_after"]),
                    },
                    OR: {
                        first_name: {
                            contains: Parser.string(req.query["name"], ""),
                        },
                        last_name: {
                            contains: Parser.string(req.query["name"], ""),
                        },
                    },
                },
                user_id: Parser.number(req.query["user"]),
            },
            include: SyndicusRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.syndicus.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: SyndicusRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const syndicus = await prisma.syndicus.create({
            data: {
                user_id: parseInt(req.body["user_id"]),
            },
        });

        return res.status(201).json(syndicus);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.syndicus.update({
            data: {
                user_id: parseInt(req.body["user_id"]),
            },
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.syndicus.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }
}
