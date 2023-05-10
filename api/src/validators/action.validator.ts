import Joi from "joi";
import { celebrate } from "celebrate";
import { Validator } from "./validator";

export class ActionValidator extends Validator {
    getAllValidator() {
        return celebrate({
            body: Joi.object().empty().required(),
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                description: Joi.string().trim(),
                sort: Joi.string().min(1),
                ord: Joi.string().min(1),
            }),
        });
    }

    getOneValidator() {
        return celebrate({
            body: Joi.object().empty().required(),
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                id: Joi.ref("params.id"),
                description: Joi.string().trim().min(1),
            }),
        });
    }

    createOneValidator() {
        return celebrate({
            body: Joi.object({
                description: Joi.string().min(1).required(),
            }),
        });
    }

    deleteOneValidator() {
        return celebrate({
            body: Joi.object().empty().required(),
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
