import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing } from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import { Validator } from "../validators/validator";
import { AddressValidator } from "../validators/address.validator";

export class AddressRouting extends Routing {
    @Auth.authorization({ superStudent: true })
    async getAll(req: CustomRequest, res: express.Response) {
        throw new APIError(APIErrorCode.METHOD_NOT_ALLOWED);
    }

    @Auth.authorization({ student: true })
    async getOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.address.findFirstOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async createOne(req: CustomRequest, res: express.Response) {
        const result = await prisma.address.create({
            data: req.body,
        });

        return res.status(201).json(result);
    }

    @Auth.authorization({ student: true })
    async updateOne(req: CustomRequest, res: express.Response) {
        const addressIdentifier = Parser.number(req.params["id"]);

        // If the user is a student, they can only update their own address.
        if (
            process.env["DISABLE_AUTH"] !== "true" &&
            !req.user?.super_student &&
            !req.user?.admin &&
            req.user?.address_id !== addressIdentifier
        ) {
            throw new APIError(APIErrorCode.FORBIDDEN);
        }

        // Update the address and return it.
        const result = await prisma.address.update({
            data: req.body,
            where: {
                id: addressIdentifier,
            },
        });

        return res.status(200).json(result);
    }

    @Auth.authorization({ superStudent: true })
    async deleteOne(req: CustomRequest, res: express.Response) {
        await prisma.address.delete({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        return res.status(200).json({});
    }

    getValidator(): Validator {
        return new AddressValidator();
    }
}
