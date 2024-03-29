import { CustomRequest, Routing, selectBuilding } from "./routing";
import express from "express";
import { prisma } from "../prisma";
import { Parser } from "../parser";
import { Auth } from "../auth/auth";
import { Prisma } from "@selab-2/groep-1-orm";
import { GarbageValidator } from "../validators/garbage.validator";
import { Validator } from "../validators/validator";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class GarbageRouting extends Routing {
    private static includes: Prisma.GarbageInclude = {
        building: selectBuilding(),
    };

    @Auth.authorization({ student: true, syndicus: true })
    async getAll(req: CustomRequest, res: express.Response) {
        // A syndicus is only allowed to see his own garbage
        if (
            !req.user?.super_student &&
            !req.user?.admin &&
            !req.user?.student &&
            req.user?.id !== Parser.number(req.query["syndicus_id"])
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

        const result = await prisma.garbage.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                // get all garbage within a certain time period: YYYY-MM-DD
                pickup_time: {
                    lte: Parser.date(req.query["before"]),
                    gte: Parser.date(req.query["after"]),
                },
                // get all garbage for a certain building
                building_id: Parser.number(req.query["building_id"]),
                // get all garbage where a certain action needs to be executed
                description: {
                    contains: req.query["description"],
                },
                // get garbage for all buildings belonging to a certain syndicus
                building: {
                    syndicus_id: Parser.number(req.query["syndicus_id"]),
                    // get garbage for all buildings belonging to a certain round
                    rounds: req.query["round_id"]
                        ? {
                              some: {
                                  round_id: Parser.number(
                                      req.query["round_id"],
                                  ),
                              },
                          }
                        : {},
                },
            },
            include: GarbageRouting.includes,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true, syndicus: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: GarbageRouting.includes,
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.create({
            data: req.body,
            include: GarbageRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.garbage.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: GarbageRouting.includes,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.garbage.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }

    getValidator(): Validator {
        return new GarbageValidator();
    }
}
