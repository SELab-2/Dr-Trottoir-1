import Joi from "joi";
import { celebrate } from "celebrate";
import { Validator } from "./validator";

export class ActionValidator extends Validator {
    getAllValidator() {
        return celebrate({
            body: Joi.object().empty().required(),
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
            body: Joi.object({
                description: Joi.string().min(1).required(),
            }),
            params: Joi.object({
                id: Joi.number().positive().required(),
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
