import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class UserRegionValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                user_id: Joi.number().positive(),
                region_id: Joi.number().positive(),
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
                user_id: Joi.number().positive().required(),
                region_id: Joi.number().positive().required(),
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
