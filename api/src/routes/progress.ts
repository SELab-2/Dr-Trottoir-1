import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Prisma } from "@selab-2/groep-1-orm";

export class ProgressRouting extends Routing {
    private static includes: Prisma.ProgressInclude = {
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
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                deleted: Parser.bool(req.query["deleted"], false),
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
                building_id: Parser.number(req.query["building"]),
                schedule_id: Parser.number(req.query["schedule"]),
                schedule: {
                    round_id: Parser.number(req.query["round"]),
                    user_id: Parser.number(req.query["user"]),
                },
            },
            include: ProgressRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            include: ProgressRouting.includes,
        });

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
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.progress.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            await prisma.progress.update({
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
