import { Validator } from "./validator";
import { celebrate, Segments } from "celebrate";
import Joi from "joi";

export class RegionValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                name: Joi.string().trim().min(1),
                user_id: Joi.number(),
                deleted: Joi.bool(),
            }),
        });
    }

    getOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    createOneValidator() {
        return celebrate({
            body: Joi.object({
                name: Joi.string().min(1).required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate(
            {
                params: Joi.object({
                    id: Joi.number().positive().required(),
                }),
                body: Joi.object({
                    id: Joi.ref("$params.id"),
                    name: Joi.string().min(1).required(),
                }),
            },
            undefined,
            { reqContext: true },
        );
    }

    deleteOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
