import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class MailTemplateValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                name: Joi.string().min(1),
                sort: Joi.string(),
                ord: Joi.string(),
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
                mail_subject: Joi.string().trim().min(1).required(),
                content: Joi.string().trim().min(1).required(),
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
                name: Joi.string().trim().min(1),
                mail_subject: Joi.string().trim().min(1),
                content: Joi.string().trim().min(1),
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
