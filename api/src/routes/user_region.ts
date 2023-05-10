import { CustomRequest, includeUser, Routing } from "./routing";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Auth } from "../auth/auth";
import { Prisma } from "@selab-2/groep-1-orm";
import { Validator } from "../validators/validator";
import { UserRegionValidator } from "../validators/user_region.validator";

export class UserRegionRouting extends Routing {
    private static includes: Prisma.UserRegionInclude = {
        user: includeUser(true),
        region: true,
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.userRegion.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                user_id: Parser.number(req.query["user_id"]),
                region_id: Parser.number(req.query["region_id"]),
            },
            include: UserRegionRouting.includes,
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.userRegion.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: UserRegionRouting.includes,
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.userRegion.create({
            data: req.body,
            include: UserRegionRouting.includes,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.userRegion.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }

    getValidator(): Validator {
        return new UserRegionValidator();
    }
}
