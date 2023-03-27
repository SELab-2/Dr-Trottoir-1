import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import crypto from "crypto";
import { User } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

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
        // De body van een request mag niet leeg zijn, alsook geen hash of salt
        // bevatten.
        if (!req.body == null || req.body.hash || req.body.salt) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // We kiezen een willekeurige salt, berekenen de hash-waarde, en slaan
        // deze tenslotte op in hun corresponderende velden.
        const user: User = req.body;
        user.salt = crypto.randomBytes(32).toString();
        user.hash = crypto
            .createHash("sha256")
            .update(req.body.password + user.salt)
            .digest("hex");

        // Voer een poging uit om de gebruiker toe te voegen.
        const result = prisma.user.create({
            data: user,
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
            },
        });

        // Ga na of het resultaat geldig is.
        if (result === undefined) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return res.status(201).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        // De body van een request mag niet leeg zijn, alsook geen hash of salt
        // bevatten.
        if (req.body == null || req.body.hash || req.body.salt) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // Indien het wachtwoord veranderd wordt
        if (req.body.password) {
            req.body.salt = crypto.randomBytes(32).toString();
            req.body.hash = crypto
                .createHash("sha256")
                .update(req.body.password + req.body.salt)
                .digest("hex");
        }

        const result = await prisma.user.update({
            data: req.body,
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
            },
        });

        return res.status(200).json(result);
    }
}
