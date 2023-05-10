import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class SyndicusValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                login_before: Joi.date().iso(),
                login_after: Joi.date().iso(),
                added_before: Joi.date().iso(),
                added_after: Joi.date().iso(),
                first_name: Joi.string().trim().min(1),
                last_name: Joi.string().trim().min(1),
                user: Joi.number().positive(),
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
                user_id: Joi.number().positive().required(),
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
                    user_id: Joi.number().positive(),
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
        });
    }
}
