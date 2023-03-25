import { CustomRequest, Routing } from "./routing";
import express from "express";
import { Parser } from "../parser";
import { prisma } from "../prisma";
import { Auth } from "../auth/auth";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

export class UserRegionRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);
        const result = await prisma.userRegion.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                user_id: Parser.number(req.query["user_id"]),
                region_id: Parser.number(req.query["region_id"]),
            },
            include: {
                user: joins?.includes("user"),
                region: joins?.includes("region"),
            },
        });

        return res.json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query["join"], []);
        const result = await prisma.userRegion.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                user: joins?.includes("user"),
                region: joins?.includes("region"),
            },
        });

        return res.json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.userRegion.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.userRegion.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }
}
