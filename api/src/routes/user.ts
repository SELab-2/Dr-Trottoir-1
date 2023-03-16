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
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                last_login: true,
                date_added: true,
                phone: true,
                address_id: true,
                student: true,
                super_student: true,
                admin: true,
                hash: false,
                salt: false,
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
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                last_login: true,
                date_added: true,
                phone: true,
                address_id: true,
                student: true,
                super_student: true,
                admin: true,
                hash: false,
                salt: false,
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
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            last_login: user.last_login,
            date_added: user.date_added,
            phone: user.phone,
            address_id: user.address_id,
            student: user.student,
            super_student: user.super_student,
            admin: user.admin,
        };

        return res.status(201).json(userWithoutPassword);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.user.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });
        const resultWithoutPassword = {
            id: result.id,
            email: result.email,
            first_name: result.first_name,
            last_name: result.last_name,
            last_login: result.last_login,
            date_added: result.date_added,
            phone: result.phone,
            address_id: result.address_id,
            student: result.student,
            super_student: result.super_student,
            admin: result.admin,
        };

        return res.status(200).json(resultWithoutPassword);
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

        const resultWithoutPassword = {
            id: result.id,
            email: result.email,
            first_name: result.first_name,
            last_name: result.last_name,
            last_login: result.last_login,
            date_added: result.date_added,
            phone: result.phone,
            address_id: result.address_id,
            student: result.student,
            super_student: result.super_student,
            admin: result.admin,
        };

        return res.status(200).json(resultWithoutPassword);
    }
}
