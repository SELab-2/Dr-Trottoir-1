import { CustomRequest, Routing, includeUser, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import {
    ProgressImageValidator,
    ProgressValidator,
} from "../validators/progress.validator";
import { Validator } from "../validators/validator";
import { SerializableUser } from "../types";

export class ProgressRouting extends Routing {
    toRouter(): express.Router {
        const router = super.toRouter();
        const imageValidator = new ProgressImageValidator();
        router.post(
            "/:id/image",
            imageValidator.createOneValidator(),
            this.createImage,
        );
        router.patch(
            "/:id/image/:image_id",
            imageValidator.updateOneValidator(),
            this.updateImage,
        );
        router.delete(
            "/:id/image/:image_id",
            imageValidator.deleteOneValidator(),
            this.deleteImage,
        );
        return router;
    }

    private static adminIncludes: Prisma.ProgressInclude = {
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

    private static nonAdminIncludes: Prisma.ProgressInclude = {
        building: selectBuilding(),
        schedule: {
            include: {
                round: true,
                user: includeUser(false),
            },
        },
        images: {
            where: {
                deleted: false,
            },
        },
    };

    private static getCorrectIncludes(
        user: SerializableUser | null,
    ): Prisma.ProgressInclude {
        if (user?.admin) {
            return ProgressRouting.adminIncludes;
        }

        return ProgressRouting.nonAdminIncludes;
    }

    @Auth.authorization({ student: true })
    async getAll(req: CustomRequest, res: express.Response) {
        // Students are only allowed to see their own progress entries
        if (
            req.user?.student &&
            !req.user?.super_student &&
            !req.user?.admin &&
            Parser.number(req.query["user"]) !== req.user?.id
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

        // only admins can choose to see deleted entries too
        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"], false)) {
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
                building_id: Parser.number(req.query["building"]),
                schedule_id: Parser.number(req.query["schedule"]),
                schedule: {
                    round_id: Parser.number(req.query["round"]),
                    user_id: Parser.number(req.query["user"]),
                },
            },
            include: ProgressRouting.getCorrectIncludes(req.user),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true, syndicus: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            include: ProgressRouting.getCorrectIncludes(req.user),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const user = await prisma.progress.create({
            data: req.body,
            include: ProgressRouting.getCorrectIncludes(req.user),
        });

        return res.status(201).json(user);
    }

    @Auth.authorization({ student: true, superStudent: false })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.progress.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: ProgressRouting.getCorrectIncludes(req.user),
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

    @Auth.authorization({ student: true, superStudent: false })
    async createImage(req: CustomRequest, res: express.Response) {
        const progress_id = Number(Parser.number(req.params["id"]));

        const newImage = await prisma.image.create({
            data: {
                time: req.body.time,
                location: req.body.location,
                path: req.body.path,
                user_id: req.body.user_id,
            },
        });

        await prisma.progressImage.create({
            data: {
                type: req.body.type,
                description: req.body.description,
                image_id: newImage.id,
                progress_id: progress_id,
            },
        });

        const result = await prisma.progress.findUniqueOrThrow({
            where: {
                id: progress_id,
            },
            include: ProgressRouting.getCorrectIncludes(req.user),
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ student: true, superStudent: false })
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
            include: ProgressRouting.getCorrectIncludes(req.user),
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

    getValidator(): Validator {
        return new ProgressValidator();
    }
}
