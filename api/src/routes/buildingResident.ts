import { prisma } from "../prisma";
import express from "express";
import { includeUser } from "./routing";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";

type CustomRequest = express.Request<any>;
export class BuildingResidentRouting {
    async getOne(req: CustomRequest, res: express.Response) {
        const hash = req.params["hash"];

        const result = await prisma.building.findUniqueOrThrow({
            where: {
                hash: hash,
            },
            select: {
                id: true,
                name: true,
                ivago_id: true,
                deleted: true,
                hash: false,
                address: true,
                syndicus: {
                    include: {
                        user: includeUser(false),
                    },
                },
                manual: true,
                images: {
                    include: {
                        image: true,
                    },
                },
                garbage: {
                    include: {
                        action: true,
                    },
                },
                progress: {
                    include: {
                        schedule: {
                            include: {
                                user: true,
                                round: true,
                            },
                        },
                        images: {
                            include: {
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        // Een bewoner mag de link niet meer gebruiken als het gebouw in de databank als "verwijderd" staat
        if (result.deleted) {
            throw new APIError(APIErrorCode.NOT_FOUND);
        }

        return res.json(result);
    }

    toRouter(): express.Router {
        const router = express.Router();
        router.get("/:hash", this.getOne);
        return router;
    }
}
