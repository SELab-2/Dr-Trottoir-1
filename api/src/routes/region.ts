import {CustomRequest, Routing} from "./routing";
import express from "express";
import {Parser} from "../parser";
import {prisma} from "../prisma";
import {Auth} from "../auth/auth";

export class RegionRouting extends Routing {
    @Auth.authorization({superStudent: true})
    async getAll(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);
        console.log(req.query)
        const result = await prisma.region.findMany({
            take: Parser.number(req.query["take"], 1024),
            skip: Parser.number(req.query["skip"], 0),
            where: {
                id: Parser.number(req.query["id"]),
                name: Parser.string(req.query["name"])
            },
            include: {
                users: {
                    include: {
                        user: joins?.includes("user")
                    }
                }
            },
        });

        return res.json(result);
    }

    @Auth.authorization({student: true})
    async getOne(req: CustomRequest, res: express.Response) {
        const joins = Parser.stringArray(req.query.join, []);
        const result = await prisma.region.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            include: {
                users: {
                    include: {
                        user: joins?.includes("user")
                    }
                },
            },
        });

        return res.json(result);
    }

    @Auth.authorization({superStudent: true})
    async createOne(req: CustomRequest, res: express.Response) {
        const connectedUsers = req.body["users"].map((id: string) => {
            return {
                user: {
                    connect: {
                        id: id
                    }
                }
            }
        });

        const result = await prisma.region.create({
            data: {
                name: req.body["name"],
                users: {
                    create: connectedUsers
                }
            }
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({superStudent: true})
    async updateOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.update({
            data: req.body,
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({superStudent: true})
    async deleteOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.region.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }
}
