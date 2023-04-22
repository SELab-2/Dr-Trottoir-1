import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, includeUser, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import crypto from "crypto";
import * as dateMath from "date-arithmetic";

export class BuildingRouting extends Routing {
    toRouter(): express.Router {
        const router = super.toRouter();
        router.post("/:id/image", this.createImage);
        router.delete("/:id/image/:image_id", this.deleteImage);
        return router;
    }

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

    private static twoWeekDelta: { gte: Date; lte: Date } = {
        gte: dateMath.subtract(new Date(), 2, "week"),
        lte: dateMath.add(new Date(), 2, "week"),
    };

    constructor() {
        super();
    }

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

    override async getOne(req: CustomRequest, res: express.Response) {
        if (Number.isNaN(parseInt(req.params["id"]))) {
            return BuildingRouting.resident(req, res);
        } else {
            return BuildingRouting.internal(req, res);
        }
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        if (Parser.string(req.body["hash"], "") !== "") {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // We use a simple 32 byte sequence to create a hidden link.
        req.body["hash"] = crypto.randomBytes(32).toString();

        const result = await prisma.building.create({
            data: req.body,
            select: BuildingRouting.selects,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        if (Parser.bool(req.body["hash"], false)) {
            req.body.hash = crypto.randomBytes(32).toString();
        }

        const result = await prisma.building.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            select: BuildingRouting.selects,
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

    @Auth.authorization({ student: true })
    static async internal(req: CustomRequest, res: express.Response) {
        const result = await prisma.building.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            select: BuildingRouting.selects,
        });

        return res.json(result);
    }

    static async resident(req: CustomRequest, res: express.Response) {
        // Default hash is the empty string, which doesn't match anything.
        const hash = Parser.string(req.params["id"], "");

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
                    where: {
                        pickup_time: this.twoWeekDelta,
                    },
                },
                progress: {
                    include: {
                        schedule: {
                            include: {
                                user: includeUser(false),
                                round: true,
                            },
                        },
                        images: {
                            include: {
                                image: true,
                            },
                        },
                    },
                    where: {
                        arrival: this.twoWeekDelta,
                        departure: this.twoWeekDelta,
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

    @Auth.authorization({ superStudent: true })
    async createImage(req: CustomRequest, res: express.Response) {
        const building_id = Number(Parser.number(req.params["id"]));
        await prisma.image.create({
            data: {
                time: req.body.time,
                location: req.body.location,
                path: req.body.path,
                user_id: req.body.user_id,
                buildings: {
                    create: [{ building_id: building_id }],
                },
            },
        });

        const result = await prisma.building.findUniqueOrThrow({
            where: {
                id: building_id,
            },
            select: BuildingRouting.selects,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteImage(req: CustomRequest, res: express.Response) {
        const result = await prisma.buildingImages.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["image_id"]),
            },
        });

        // Use cascade delete of Image
        await prisma.image.delete({
            where: {
                id: result.image_id,
            },
        });

        return res.status(200).json({});
    }
}
