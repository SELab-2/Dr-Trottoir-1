import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class RoundBuildingValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                round_id: Joi.number().positive(),
                building_id: Joi.number().positive(),
                round: Joi.string().trim().min(1),
                building: Joi.string().trim().min(1),
                ivago_id: Joi.string().trim().min(1),
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
                round_id: Joi.number().positive().required(),
                building_id: Joi.number().positive().required(),
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
                    round_id: Joi.number().positive(),
                    building_id: Joi.number().positive(),
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

            body: Joi.object({
                hardDelete: Joi.bool(),
            }),
        });
    }
}
