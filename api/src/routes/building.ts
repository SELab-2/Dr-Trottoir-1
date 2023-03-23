import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class BuildingRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);

        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"])) {
            deleted = undefined;
        }

        const result = await prisma.building.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                name: req.query["name"],
                ivago_id: req.query["ivago_id"],
                syndicus_id: Parser.number(req.query["syndicus_id"]),
                deleted: deleted,
            },
            include: {
                address: joins?.includes("address"),
                syndicus: {
                    include: {
                        user: includeUser(joins?.includes("syndicus"), false),
                    },
                },
                manual: joins?.includes("manual"),
                garbage: joins?.includes("garbage"),
                progress: joins?.includes("progress"),
                rounds: joins?.includes("rounds"),
                images: joins?.includes("images"),
            },
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);

        const result = await prisma.building.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                address: joins?.includes("address"),
                syndicus: {
                    include: {
                        user: includeUser(joins?.includes("syndicus"), false),
                    },
                },
                manual: joins?.includes("manual"),
                garbage: joins?.includes("garbage"),
                progress: joins?.includes("progress"),
                rounds: joins?.includes("rounds"),
                images: joins?.includes("images"),
            },
        });

        if (result.deleted && !req.user?.admin) {
            throw new APIError(APIErrorCode.NOT_FOUND);
        }

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
        const hardDelete = req.body["hardDelete"];
        let result;

        if (req.user?.admin && hardDelete) {
            result = await prisma.building.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            result = await prisma.building.update({
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
