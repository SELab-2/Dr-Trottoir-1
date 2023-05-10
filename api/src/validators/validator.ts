import { celebrate } from "celebrate";
import Joi from "joi";
import express from "express";

/**
 * Default Validator class, containing empty rules for body, query and params.
 * To be used as a template for the proper implementation.
 */
export abstract class Validator {
    getAllValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    getOneValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    createOneValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    updateOneValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }

    deleteOneValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object(),
            query: Joi.object(),
            params: Joi.object(),
        });
    }
}
