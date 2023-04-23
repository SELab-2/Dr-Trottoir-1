import { CustomRequest, Routing, includeUser, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class ProgressRouting extends Routing {
    toRouter(): express.Router {
        const router = super.toRouter();
        router.post("/:id/image", this.createImage);
        router.patch("/:id/image/:image_id", this.updateImage);
        router.delete("/:id/image/:image_id", this.deleteImage);
        return router;
    }

    private static includes: Prisma.ProgressInclude = {
        building: selectBuilding(),
        schedule: {
            include: {
                round: true,
                user: includeUser(false),
            },
        },
        images: {
            include: {
                image: true,
            },
        },
    };

    @Auth.authorization({ student: true })
    async getAll(req: CustomRequest, res: express.Response) {
        // Students are only allowed to see their own progress entries
        if (
            req.user?.student &&
            !req.user?.super_student &&
            !req.user?.admin &&
            Parser.number(req.query["user_id"]) != req.user?.id
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

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
        const result = await prisma.progress.findFirstOrThrow({
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
            include: ProgressRouting.includes,
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
            include: ProgressRouting.includes,
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

    @Auth.authorization({ student: true })
    async createImage(req: CustomRequest, res: express.Response) {
        const progress_id = Number(Parser.number(req.params["id"]));

        await prisma.image.create({
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
                            progress_id: progress_id,
                        },
                    ],
                },
            },
        });

        const result = await prisma.progress.findUniqueOrThrow({
            where: {
                id: progress_id,
            },
            include: ProgressRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ student: true })
    async updateImage(req: CustomRequest, res: express.Response) {
        await prisma.progressImage.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["image_id"]),
            },
        });

        const result = await prisma.progress.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: ProgressRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async deleteImage(req: CustomRequest, res: express.Response) {
        if (Parser.bool(req.body["hardDelete"], false)) {
            const result = await prisma.progressImage.findUniqueOrThrow({
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
        } else {
            await prisma.progressImage.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Parser.number(req.params["image_id"]),
                },
            });
        }

        return res.status(200).json({});
    }
}
