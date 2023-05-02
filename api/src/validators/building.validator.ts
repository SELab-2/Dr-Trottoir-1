import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class BuildingValidator extends Validator {
    createOneValidator() {
        return celebrate({
            body: Joi.object({
                name: Joi.string().min(1).required(),
                ivago_id: Joi.string().min(1).required(),
                address_id: Joi.number().positive().required(),
                manual_id: Joi.number().positive().required(),
                syndicus_id: Joi.number().positive().required(),
                hash: Joi.string().forbidden(),
            }),

            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            body: Joi.object({
                name: Joi.string().min(1),
                ivago_id: Joi.string().min(1),
                address_id: Joi.number().positive(),
                manual_id: Joi.number().positive(),
                syndicus_id: Joi.number().positive(),
                hash: Joi.string().forbidden(),
            }),

            params: Joi.object({
                id: Joi.number().positive().required(),
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
