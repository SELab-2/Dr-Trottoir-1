import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class BuildingRouting extends Routing {
    private static selects: Prisma.BuildingSelect = {
        id: true,
        name: true,
        ivago_id: true,
        deleted: true,
        hash: false,
        address: true,
        syndicus: {
            include: {
                user: includeUser(false),
            },
        },
        manual: true,
        images: {
            include: {
                image: true,
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                name: req.query["name"],
                ivago_id: req.query["ivago_id"],
                syndicus_id: Parser.number(req.query["syndicus_id"]),
                deleted: Parser.bool(req.query["deleted"], false),
            },
            select: BuildingRouting.selects,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            select: BuildingRouting.selects,
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
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.building.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            await prisma.building.update({
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

    async resident(req: CustomRequest, res: express.Response) {
        // Default hash is the empty string, which doesn't match anything.
        const hash = Parser.string(req.params["hash"], "");

        const result = await prisma.building.findUniqueOrThrow({
            where: {
                hash: hash,
            },
            select: {
                id: true,
                name: true,
                ivago_id: true,
                deleted: true,
                hash: false,
                address: true,
                syndicus: {
                    include: {
                        user: includeUser(false),
                    },
                },
                manual: true,
                images: {
                    include: {
                        image: true,
                    },
                },
                garbage: {
                    include: {
                        action: true,
                    },
                },
                progress: {
                    include: {
                        schedule: {
                            include: {
                                user: true,
                                round: true,
                            },
                        },
                        images: {
                            include: {
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        // Residents may not see their building if it has been soft deleted.
        if (result.deleted) {
            throw new APIError(APIErrorCode.NOT_FOUND);
        }

        return res.json(result);
    }


    toRouter(): express.Router {
        const router = super.toRouter();
        router.get("/resident/:hash", this.resident);
        return router
    }
}
