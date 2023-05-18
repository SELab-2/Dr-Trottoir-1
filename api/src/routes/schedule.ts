import { CustomRequest, Routing, includeUser, selectBuilding } from "./routing";
import { Auth } from "../auth/auth";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Prisma } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import { Validator } from "../validators/validator";
import { ScheduleValidator } from "../validators/schedule.validator";

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

    @Auth.authorization({ student: true, syndicus: true })
    async getAll(req: CustomRequest, res: express.Response) {
        // Students are only allowed to see their own schedules
        if (
            req.user?.student &&
            !req.user?.super_student &&
            !req.user?.admin &&
            Parser.number(req.query["user_id"]) !== req.user?.id
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

        // only admins can choose to see deleted entries too
        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"], false)) {
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
                            contains: Parser.string(
                                req.query["first_name"],
                                "",
                            ),
                        },
                        last_name: {
                            contains: Parser.string(req.query["last_name"], ""),
                        },
                    },
                },
                round: {
                    name: req.query["round"],
                    buildings: req.query["building"]
                        ? {
                              some: {
                                  building_id: Parser.number(
                                      req.query["building"],
                                  ),
                              },
                          }
                        : {},
                },
            },
            include: ScheduleRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true, syndicus: true })
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
        const schedule = await prisma.schedule.create({
            data: req.body,
            include: ScheduleRouting.includes,
        });

        // Retrieve all the buildings in the round.
        const round = await prisma.round.findUniqueOrThrow({
            where: {
                id: Parser.number(req.body["round_id"]),
            },
            include: {
                buildings: {
                    select: {
                        building_id: true,
                    },
                },
            },
        });

        // Create a progress item for each building in the round.
        for (const building of round.buildings) {
            await prisma.progress.create({
                data: {
                    building_id: building.building_id,
                    schedule_id: schedule.id,
                    report: "", // TODO: make nullable
                },
            });
        }

        return res.status(201).json(schedule);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        if (req.user?.student) {
            // a student may only change the start and end timestamp of their schedule
            const allowedFields = ["start", "end"];

            for (let entry in req.body) {
                if (!allowedFields.includes(entry)) {
                    throw new APIError(APIErrorCode.BAD_REQUEST);
                }
            }

            const schedule = await prisma.schedule.findUniqueOrThrow({
                where: {
                    id: Parser.number(req.params["id"]),
                },
            });

            // should the user try to change a schedule they're not linked to, throw an error
            if (schedule.user_id !== req.user?.id) {
                throw new APIError(APIErrorCode.FORBIDDEN);
            }
        }

        const result = await prisma.schedule.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: ScheduleRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        let result;
        if (Parser.bool(req.body["hardDelete"], false)) {
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

    getValidator(): Validator {
        return new ScheduleValidator();
    }
}
