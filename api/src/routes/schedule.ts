import { CustomRequest, Routing, includeUser, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Prisma } from "@selab-2/groep-1-orm";

export class ScheduleRouting extends Routing {
    private static includes: Prisma.ScheduleInclude = {
        user: includeUser(true),
        round: {
            include: {
                buildings: {
                    include: {
                        building: selectBuilding(),
                    },
                },
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.schedule.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                deleted: Parser.bool(req.query["deleted"], false),
                day: {
                    lte: Parser.date(req.query["before"]),
                    gte: Parser.date(req.query["after"]),
                },
                user_id: Parser.number(req.query["user_id"]),
                round_id: Parser.number(req.query["round_id"]),
                user: {
                    OR: {
                        first_name: {
                            contains: Parser.string(req.query["user_name"], ""),
                        },
                        last_name: {
                            contains: Parser.string(req.query["user_name"], ""),
                        },
                    },
                },
                round: {
                    name: req.query["round"],
                },
            },
            include: ScheduleRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.schedule.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            include: ScheduleRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const user = await prisma.schedule.create({
            data: req.body,
        });

        return res.status(201).json(user);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.schedule.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.schedule.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            await prisma.schedule.update({
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
