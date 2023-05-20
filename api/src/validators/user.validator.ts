import { Validator } from "./validator";
import { celebrate } from "celebrate";
import Joi from "joi";

import { JoiPasswordExtend, joiPasswordExtendCore } from "joi-password";

const joiPassword: JoiPasswordExtend = Joi.extend(joiPasswordExtendCore);

export class UserValidator extends Validator {
    passwordValidator = joiPassword
        .string()
        .trim()
        .min(8) // minimum of 8 characters
        .minOfNumeric(1) // at least one numberic character
        .minOfUppercase(1) // at least one uppercase character
        .minOfSpecialCharacters(1); // at least one special character

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
                deleted: Joi.bool(),
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
                    .regex(/^\+?[0-9]+$/)
                    .required(),
                address_id: Joi.number().positive().required(),
                student: Joi.boolean().required(),
                super_student: Joi.boolean().required(),
                admin: Joi.boolean().required(),
                password: this.passwordValidator.required(),
                hash: Joi.forbidden(),
                salt: Joi.forbidden(),
            }),
        });
    }

    updateOneValidator() {
        return celebrate(
            {
                params: Joi.object({
                    id: Joi.number().positive().required(),
                }),
                body: {
                    id: Joi.ref("$params.id"),
                    email: Joi.string().email(),
                    first_name: Joi.string().min(1),
                    last_name: Joi.string().min(1),
                    date_added: Joi.date(),
                    last_login: Joi.date().less(Joi.ref("date_added")),
                    phone: Joi.string()
                        .min(1)
                        // accept a potential + sign at the beginning of the number and at least 1 digit
                        .regex(/^\+?[0-9]+$/),
                    address_id: Joi.number().positive(),
                    deleted: Joi.bool(),
                    student: Joi.boolean(),
                    super_student: Joi.boolean(),
                    admin: Joi.boolean(),
                    password: this.passwordValidator,
                },
            },
            undefined,
            { reqContext: true },
        );
    }

    deleteOneValidator() {
        return celebrate({
            body: Joi.object({
                id: Joi.forbidden(),
                hardDelete: Joi.boolean(),
            }),
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
