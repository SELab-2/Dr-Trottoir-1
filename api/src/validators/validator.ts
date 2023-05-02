import { celebrate } from "celebrate";
import Joi from "joi";

/**
 * Default Validator class, containing empty rules for body, query and params.
 * To be used as a template for the proper implementation.
 */
export abstract class Validator {
    getAllValidator() {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    getOneValidator() {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    createOneValidator() {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    updateOneValidator() {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    deleteOneValidator() {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }
}
