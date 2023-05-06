import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class AddressValidator extends Validator {
    getOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    createOneValidator() {
        return celebrate({
            params: Joi.object().empty().required(), // force empty parameters
            body: Joi.object({
                street: Joi.string().min(1).required(),
                city: Joi.string().min(1).required(),
                zip_code: Joi.number().positive().required(),
                number: Joi.number().positive().required(),
                longitude: Joi.number().min(-180).max(180).required(),
                latitude: Joi.number().min(-90).max(90).required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                id: Joi.forbidden(),
                street: Joi.string().min(1),
                city: Joi.string().min(1),
                zip_code: Joi.number().positive(),
                number: Joi.number().positive(),
                longitude: Joi.number().min(-180).max(180),
                latitude: Joi.number().min(-90).max(90),
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
