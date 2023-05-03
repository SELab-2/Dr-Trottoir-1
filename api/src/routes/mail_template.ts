import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";

export class MailTemplateRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        const result = await prisma.mailTemplate.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                name: {
                    contains: Parser.string(req.query["name"], ""),
                },
            },
            orderBy: Parser.order(req.query["sort"], req.query["ord"]),
        });
        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.mailTemplate.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const action = await prisma.mailTemplate.create({
            data: req.body,
        });

        return res.status(201).json(action);
    }

    @Auth.authorization({ superStudent: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.mailTemplate.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.mailTemplate.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }
}
