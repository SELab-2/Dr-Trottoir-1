import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";

export class UserRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);

        const result = await prisma.user.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                student: Parser.bool(req.query["student"]),
                super_student: Parser.bool(req.query["super_student"]),
                admin: Parser.bool(req.query["admin"]),
                last_login: {
                    lte: Parser.date(req.query["login_before"]),
                    gte: Parser.date(req.query["login_after"]),
                },
                date_added: {
                    lte: Parser.date(req.query["added_before"]),
                    gte: Parser.date(req.query["added_after"]),
                },
                OR: {
                    first_name: {
                        contains: Parser.string(req.query["name"], ""),
                    },
                    last_name: {
                        contains: Parser.string(req.query["name"], ""),
                    },
                },
                // get all users assigned to a certain region
                regions: {
                    some: {
                        region_id: Parser.number(req.query["region_id"]),
                    },
                },
            },
            include: {
                address: true,
                regions: joins?.includes("regions"),
                schedule: joins?.includes("schedule"),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);

        const result = await prisma.user.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                address: true,
                regions: joins?.includes("regions"),
                schedule: joins?.includes("schedule"),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const user = await prisma.user.create({
            data: req.body,
        });

        return res.status(201).json(user);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.user.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        // TODO: delete cascade in the database!
        await prisma.userRegion.deleteMany({
            where: {
                user_id: Parser.number(req.params["id"]),
            },
        });

        const result = await prisma.user.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }
}
