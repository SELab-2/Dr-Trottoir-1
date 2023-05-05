import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

export class UserValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                deleted: Joi.bool(),
                take: Joi.number(),
                skip: Joi.number(),
                student: Joi.bool(),
                super_student: Joi.bool(),
                admin: Joi.bool(),
                login_before: Joi.date().iso(),
                login_after: Joi.date().iso(),
                added_before: Joi.date().iso(),
                added_after: Joi.date().iso(),
                first_name: Joi.string().trim(),
                last_name: Joi.string().trim(),
                region_id: Joi.number().positive(),
                sort: Joi.string().trim(),
                ord: Joi.string().trim(),
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
                email: Joi.string().email().required(),
                first_name: Joi.string().trim().min(1).required(),
                last_name: Joi.string().trim().min(1).required(),
                date_added: Joi.date().required(),
                last_login: [
                    Joi.date().greater(Joi.ref("date_added")).required(),
                    Joi.date().equal(Joi.ref("date_added")).required(),
                ],
                phone: Joi.string()
                    .trim()
                    .min(1)
                    // accept a potential + sign at the beginning of the number and at least 1 digit
                    .regex(/^\+?\d+$/)
                    .required(),
                address: Joi.object({
                    create: Joi.object({
                        city: Joi.string().trim().min(1),
                        latitude: Joi.number().min(-90).max(90),
                        longitude: Joi.number().min(-180).max(180),
                        number: Joi.number(),
                        street: Joi.string().trim().min(1),
                        zip_code: Joi.number(),
                    }),
                }),

                student: Joi.boolean().required(),
                super_student: Joi.boolean().required(),
                admin: Joi.boolean().required(),
                password: Joi.string().min(1).required(),
                hash: Joi.forbidden(),
                salt: Joi.forbidden(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate({
            body: {
                email: Joi.string().email(),
                first_name: Joi.string().min(1),
                last_name: Joi.string().min(1),
                date_added: Joi.date(),
                last_login: Joi.date().less(Joi.ref("date_added")),
                phone: Joi.string()
                    .min(1)
                    // accept a potential + sign at the beginning of the number and at least 1 digit
                    .regex(/^\\+?d\\+$/),
                address_id: Joi.number().positive(),
                student: Joi.boolean(),
                super_student: Joi.boolean(),
                admin: Joi.boolean(),
                password: Joi.string().min(1),
            },
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    deleteOneValidator() {
        return celebrate({
            body: Joi.object({
                hardDelete: Joi.boolean(),
            }),
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
