import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class RegionValidator extends Validator {
    deleteOneValidator() {
        return celebrate({
            body: Joi.object({
                deleted: Joi.boolean(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            body: Joi.object({
                name: Joi.string().min(1).required(),
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
}
