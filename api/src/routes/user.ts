import {prisma} from "../prisma";
import express from "express";

const DEFAULT_PAGE_SIZE = 1024;

export class UserRouting {
    async getAll(req: express.Request, res: express.Response) {
        const limit = Number(req.query['limit'] ?? DEFAULT_PAGE_SIZE);
        const offset = Number(req.query['offset'] ?? 0);

        const result = await prisma.user.findMany({
            take: limit,
            skip: offset,
        });

        return res.json(result);
    }

    async getOne(req: express.Request, res: express.Response) {
        try {
            const id = Number(req.params['id']);

            const result = await prisma.user.findFirst({
                where: {
                    id: id
                },
            });

            return res.json(result);
        } catch (e) {
            return res.json(e);
        }
    }

    toRouter(): express.Router {
        const router = express.Router();
        router.get('/', (req: express.Request, res: express.Response) => this.getAll(req, res));
        router.get('/:id', (req: express.Request, res: express.Response) => this.getOne(req, res));
        return router;
    }
}
