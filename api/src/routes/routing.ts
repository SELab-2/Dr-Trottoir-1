import express from "express";

export abstract class Routing {
    abstract getAll(req: express.Request, res: express.Response): void;

    abstract getOne(req: express.Request, res: express.Response): void;

    abstract createOne(req: express.Request, res: express.Response): void;

    abstract updateOne(req: express.Request, res: express.Response): void;

    abstract deleteOne(req: express.Request, res: express.Response): void;

    toRouter(): express.Router {
        const router = express.Router();
        router.get('/', this.getAll);
        router.get('/:id', this.getOne);
        router.post('/', this.createOne);
        router.patch('/:id', this.updateOne);
        router.delete('/:id', this.deleteOne);
        return router;
    }
}
