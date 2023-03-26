import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing, includeUser } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";

export class BuildingRouting extends Routing {

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.file.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }


    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {

        const result = await prisma.file.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
            select: {
                
            },
        });

        return res.status(200).json(result);
    }
}