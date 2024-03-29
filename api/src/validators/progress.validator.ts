import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class ProgressValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                deleted: Joi.bool(),
                take: Joi.number(),
                skip: Joi.number(),
                report: Joi.string().trim().min(1),
                arrived_before: Joi.date().iso(),
                arrived_after: Joi.date().iso(),
                left_before: Joi.date().iso(),
                left_after: Joi.date().iso(),
                building: Joi.number().positive(),
                schedule: Joi.number().positive(),
                round: Joi.number().positive(),
                user: Joi.number().positive(),
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
                report: Joi.string().trim().required(),
                arrival: Joi.date().iso(),
                departure: Joi.date().iso(),
                building_id: Joi.number().positive().required(),
                schedule_id: Joi.number().positive().required(),
                deleted: Joi.bool(),
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
                    report: Joi.string().trim(),
                    arrival: Joi.date().iso(),
                    departure: Joi.date().iso(),
                    building_id: Joi.number().positive(),
                    schedule_id: Joi.number().positive(),
                    deleted: Joi.bool(),
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

export class ProgressImageValidator extends Validator {
    createOneValidator() {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                image_id: Joi.number().positive().required(),
                type: Joi.string()
                    .trim()
                    .valid("ARRIVAL", "DEPARTURE", "GARBAGE"),
                description: Joi.string().trim().min(1).required(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate(
            {
                params: Joi.object({
                    id: Joi.number().positive().required(),
                    image_id: Joi.number().positive().required(),
                }),
                body: Joi.object({
                    type: Joi.string()
                        .trim()
                        .valid("ARRIVAL", "DEPARTURE", "GARBAGE"),
                    description: Joi.string().trim().min(1),
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
                image_id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                hardDelete: Joi.bool(),
            }),
        });
    }
}
