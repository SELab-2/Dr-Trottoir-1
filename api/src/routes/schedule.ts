import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class ScheduleRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query["join"], []);

        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"])) {
            deleted = undefined;
        }

        const result = await prisma.schedule.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                deleted: deleted,
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
            include: {
                user: includeUser(joins?.includes("user"), false),
                round: joins?.includes("round"),
                progress: joins?.includes("progress"),
            },
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query["join"], []);

        const result = await prisma.schedule.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                user: includeUser(joins?.includes("user"), false),
                round: {
                    include: {
                        buildings: {
                            select: {
                                building: true,
                            },
                        },
                    },
                },
                progress: joins?.includes("progress"),
            },
        });

        if (result.deleted && !req.user?.admin) {
            throw new APIError(APIErrorCode.NOT_FOUND);
        }

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
        const hardDelete = req.body["hardDelete"];
        let result;

        if (req.user?.admin && hardDelete) {
            result = await prisma.schedule.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            result = await prisma.schedule.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        }

        return res.status(200).json(result);
    }
}
