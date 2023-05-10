import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class ScheduleValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                user_id: Joi.number().positive(),
                deleted: Joi.bool(),
                take: Joi.number(),
                skip: Joi.number(),
                before: Joi.date(),
                after: Joi.date(),
                round_id: Joi.number().positive(),
                first_name: Joi.string().trim().min(1),
                last_name: Joi.string().trim().min(1),
                round: Joi.string().trim().min(1),
                building: Joi.number().positive(),
                sort: Joi.string().trim().min(1),
                ord: Joi.string().trim().min(1),
                start: Joi.string().isoDate(),
                end: Joi.string().isoDate(),
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
                day: Joi.date().iso().required(),
                user_id: Joi.number().positive().required(),
                round_id: Joi.number().positive().required(),
                start: Joi.string().isoDate(),
                end: Joi.string().isoDate(),
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
                day: Joi.date().iso(),
                user_id: Joi.number().positive(),
                round_id: Joi.number().positive(),
                start: Joi.string().isoDate(),
                end: Joi.string().isoDate(),
            }),
        });
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
