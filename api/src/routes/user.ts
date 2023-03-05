import {prisma} from "../prisma";
import express from "express";
import {Prisma} from "@prisma/client";
import {Routing} from "./abstract";

const DEFAULT_PAGE_SIZE = 1024;

export class UserRouting extends Routing {
    async getAll(req: express.Request, res: express.Response) {
        if (!req.user?.super_student && !req.user?.admin) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const limit = Number(req.query['limit'] ?? DEFAULT_PAGE_SIZE);
        const offset = Number(req.query['offset'] ?? 0);
        const student = req.query['student'] == 'true' ? true : req.query['student'] == 'false' ? false : undefined;
        const superStudent = req.query['super_student'] == 'true' ? true : req.query['super_student'] == 'false' ? false : undefined;
        const admin = req.query['admin'] == 'true' ? true : req.query['admin'] == 'false' ? false : undefined;

        if (Number.isNaN(limit) || Number.isNaN(offset)) {
            return res.status(400).json({message: "Bad Request"});
        }

        const result = await prisma.user.findMany({
            take: limit,
            skip: offset,
            where: {
                student: student,
                super_student: superStudent,
                admin: admin,
            },
            include: {
                address: true,
                regions: true,
                schedule: true,
            }
        });

        return res.json(result);
    }

    async getOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({message: "Bad Request"});
        }

        if (id !== req.user?.id || !req.user.super_student || !req.user.admin) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const result = await prisma.user.findFirst({
            where: {
                id: id
            },
            include: {
                address: true,
                regions: true,
                schedule: true,
            }
        });

        return res.json(result);
    }

    async createOne(req: express.Request, res: express.Response) {
        if (!req.user?.super_student || !req.user?.admin) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const user = await prisma.user.create({
            data: req.body,
        });

        return res.status(201).json(user);
    }

    async updateOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({message: "Bad Request"});
        }

        if (id !== req.user?.id && !req.user?.super_student && !req.user?.admin) {
            res.status(403);
            res.send("Unauthorized")
            return;
        }

        const result = await prisma.user.update({
            data: req.body,
            where: {
                id: id
            },
        });

        return res.status(200).json(result);
    }

    async deleteOne(req: express.Request, res: express.Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).send("Invalid Request");
        }

        if (id !== req.user?.id && !req.user?.super_student && !req.user?.admin) {
            res.status(403);
            res.send("Unauthorized")
            return;
        }

        // TODO: delete cascade in the database!
        await prisma.userRegion.deleteMany({
            where: {
                user_id: id
            },
        })

        try {
            const result = await prisma.user.delete({
                where: {
                    id: id
                },
            });

            return res.status(200).json(result);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        return res.status(404).json({message: "Not Found"})
                }
            }

            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}
