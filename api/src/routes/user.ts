import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import crypto from "crypto";
import { Prisma, User } from "@selab-2/groep-1-orm";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import { UserValidator } from "../validators/user.validator";
import { Validator } from "../validators/validator";

export class UserRouting extends Routing {
    private static selects: Prisma.UserSelect = {
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
        deleted: true,
        hash: false,
        salt: false,
        address: true,
        regions: {
            include: {
                region: true,
            },
        },
    };

    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        // only admins can choose to see deleted entries too
        let deleted: boolean | undefined = false;
        if (req.user?.admin && Parser.bool(req.query["deleted"], false)) {
            deleted = undefined;
        }

        const result = await prisma.user.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                student: Parser.bool(req.query["student"]),
                super_student: Parser.bool(req.query["super_student"]),
                admin: Parser.bool(req.query["admin"]),
                deleted: deleted,
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
                        contains: Parser.string(req.query["first_name"], ""),
                    },
                    last_name: {
                        contains: Parser.string(req.query["last_name"], ""),
                    },
                },
                // get all users assigned to a certain region
                regions: req.query["region_id"]
                    ? {
                          some: {
                              region_id: Parser.number(req.query["region_id"]),
                          },
                      }
                    : {},
            },
            select: UserRouting.selects,
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.user.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
                deleted: req.user?.admin ? undefined : false,
            },
            select: UserRouting.selects,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        // The body of a request can't be empty and can't contain a hash or salt
        if (!req.body == null || req.body.hash || req.body.salt) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // We choose a random salt, calculate the hash-value and save these in their corresponding fields
        const password = req.body.password;
        delete req.body.password;
        const user: User = req.body;
        user.salt = crypto.randomBytes(32).toString();
        user.hash = crypto
            .createHash("sha256")
            .update(password + user.salt)
            .digest("hex");

        const result = await prisma.user.create({
            data: user,
            select: UserRouting.selects,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ student: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        // Students are only allowed to change their own account
        if (
            req.user?.student &&
            !req.user?.super_student &&
            !req.user?.admin &&
            Parser.number(req.params["id"]) !== req.user?.id
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

        // The body of a request can't be empty and can't contain a hash or salt
        if (req.body == null || req.body.hash || req.body.salt) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        // The request might want to change the password
        if (req.body.password) {
            req.body.salt = crypto.randomBytes(32).toString();
            req.body.hash = crypto
                .createHash("sha256")
                .update(req.body.password + req.body.salt)
                .digest("hex");
            delete req.body.password;
        }

        const result = await prisma.user.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
            select: UserRouting.selects,
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        if (Parser.bool(req.body["hardDelete"], false)) {
            await prisma.user.delete({
                where: {
                    id: Parser.number(req.params["id"]),
                },
                select: UserRouting.selects,
            });
        } else {
            await prisma.user.update({
                data: {
                    deleted: true,
                },
                where: {
                    id: Parser.number(req.params["id"]),
                },
                select: UserRouting.selects,
            });
        }
        return res.status(200).json({});
    }

    getValidator(): Validator {
        return new UserValidator();
    }
}
