import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class ProgressRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"])) {
            deleted = undefined;
        }

        const result = await prisma.progress.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                deleted: deleted,
                report: {
                    contains: Parser.string(req.query["report"], ""),
                },
                arrival: {
                    lte: Parser.date(req.query["arrived_before"]),
                    gte: Parser.date(req.query["arrived_after"]),
                },
                departure: {
                    lte: Parser.date(req.query["left_before"]),
                    gte: Parser.date(req.query["left_after"]),
                },
                building_id: Parser.number(req.query["building_id"]),
                schedule_id: Parser.number(req.query["schedule_id"]),
                building: {
                    name: Parser.string(req.query["building"]),
                    ivago_id: Parser.string(req.query["ivago_id"]),
                },
                schedule: {
                    round_id: Parser.number(req.query["round_id"]),
                    user_id: Parser.number(req.query["user_id"]),
                },
            },
            include: {
                building: {
                    include: {
                        address: true,
                    },
                },
                schedule: {
                    include: {
                        round: true,
                        user: includeUser(false),
                    },
                },
                images: true,
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                building: {
                    include: {
                        address: true,
                    },
                },
                schedule: {
                    include: {
                        round: true,
                        user: includeUser(false),
                    },
                },
                images: true,
            },
        });

        if (result.deleted && !req.user?.admin) {
            throw new APIError(APIErrorCode.NOT_FOUND);
        }

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const user = await prisma.progress.create({
            data: req.body,
        });

        return res.status(201).json(user);
    }

    @Auth.authorization({ student: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.update({
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
            result = await prisma.progress.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            result = await prisma.progress.update({
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
