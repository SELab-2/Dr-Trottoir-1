import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class RoundValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number().positive(),
                skip: Joi.number().positive(),
                name: Joi.string().trim().min(1),
                sort: Joi.string().trim().min(1),
                ord: Joi.string().trim().min(1),
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
                name: Joi.string().trim().min(1).required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                name: Joi.string().trim().min(1),
            }),
        });
    }

    deleteOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
