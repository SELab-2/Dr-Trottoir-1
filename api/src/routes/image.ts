import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { Prisma } from "@selab-2/groep-1-orm";

export class ImageRouting extends Routing {
    private static includes: Prisma.ImageInclude = {
        buildings: {
            include: {
                building: selectBuilding(),
            },
        },
        progress: {
            include: {
                progress: true,
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.image.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                time: {
                    lte: Parser.date(req.query["before"]),
                    gte: Parser.date(req.query["after"]),
                },
                path: {
                    contains: Parser.string(req.query["path"], ""),
                },
                user_id: Parser.number(req.query["user_id"]),
                // find all images belonging to a certain building
                buildings: {
                    every: {
                        building_id: Parser.number(req.query["building_id"]),
                    },
                },
                // find all images belonging to a certain progress
                progress: {
                    every: {
                        progress_id: Parser.number(req.query["progress_id"]),
                    },
                },
            },
            include: ImageRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.image.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: ImageRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const type = req.query["type"];

        if (type === "building") {
            return ImageRouting.createBuildingImage(req, res);
        } else if (type === "progress") {
            return ImageRouting.createProgressImage(req, res);
        } else {
            const image = {
                time: req.body.time,
                location: req.body.location,
                path: req.body.path,
                user_id: req.body.user_id,
            };

            const result = await prisma.image.create({
                data: image,
                include: ImageRouting.includes,
            });

            return res.status(201).json(result);
        }
    }

    static async createBuildingImage(
        req: CustomRequest,
        res: express.Response,
    ) {
        const result = await prisma.image.create({
            data: {
                time: req.body.time,
                location: req.body.location,
                path: req.body.path,
                user_id: req.body.user_id,
                buildings: {
                    create: [{ building_id: req.body.building_id }],
                },
            },
            include: ImageRouting.includes,
        });

        return res.status(201).json(result);
    }

    static async createProgressImage(
        req: CustomRequest,
        res: express.Response,
    ) {
        const result = await prisma.image.create({
            data: {
                time: req.body.time,
                location: req.body.location,
                path: req.body.path,
                user_id: req.body.user_id,
                progress: {
                    create: [
                        {
                            type: req.body.type,
                            description: req.body.description,
                            progress_id: req.body.progress_id,
                        },
                    ],
                },
            },
            include: ImageRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ student: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const type = req.query["type"];
        let image_id: number;

        if (type === "building") {
            image_id = await ImageRouting.updateBuildingImage(req);
        } else if (type === "progress") {
            image_id = await ImageRouting.updateProgressImage(req);
        } else {
            const result = await prisma.image.update({
                data: req.body,
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
            image_id = result.id;
        }

        // Show the updated image with all info (not just the BuildingImage or ProgressImage)
        const result = await prisma.image.findUniqueOrThrow({
            where: {
                id: image_id,
            },
            include: ImageRouting.includes,
        });

        return res.status(200).json(result);
    }

    static async updateBuildingImage(req: CustomRequest) {
        const result = await prisma.buildingImages.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return result.image_id;
    }

    static async updateProgressImage(req: CustomRequest) {
        const result = await prisma.progressImage.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return result.image_id;
    }

    @Auth.authorization({ student: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const type = req.query["type"];

        if (type === "building") {
            return ImageRouting.deleteBuildingImage(req, res);
        } else if (type === "progress") {
            return ImageRouting.deleteProgressImage(req, res);
        } else {
            await prisma.image.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });

            return res.status(200).json({});
        }
    }

    static async deleteBuildingImage(
        req: CustomRequest,
        res: express.Response,
    ) {
        await prisma.buildingImages.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }

    static async deleteProgressImage(
        req: CustomRequest,
        res: express.Response,
    ) {
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.progressImage.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });
        } else {
            await prisma.progressImage.update({
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
