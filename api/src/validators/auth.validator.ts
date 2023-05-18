import { celebrate } from "celebrate";
import Joi from "joi";

export const loginValidator = () => {
    return celebrate({
        body: Joi.object({
            username: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(1).required(),
        }),
    });
};
