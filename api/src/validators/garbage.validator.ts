import { Validator } from "./validator";
import express from "express";
import { celebrate } from "celebrate";
import Joi from "joi";

export class GarbageValidator extends Validator {
    getAllValidator() {
        return celebrate({
            query: Joi.object({
                take: Joi.number(),
                skip: Joi.number(),
                before: Joi.date().iso(),
                after: Joi.date().iso(),
                building_id: Joi.number(),
                action_id: Joi.number(),
                syndicus_id: Joi.number(),
                round_id: Joi.number(),
                sort: Joi.string(),
                ord: Joi.string(),
            }),
        });
    }

    getOneValidator(): express.RequestHandler<any> {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }

    createOneValidator(): express.RequestHandler<any> {
        return celebrate({
            body: Joi.object({
                pickup_time: Joi.date().iso().required(),
                action_id: Joi.number().positive().required(),
                building_id: Joi.number().positive().required(),
            }),
        });
    }

    updateOneValidator(): express.RequestHandler<any> {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
            body: Joi.object({
                id: Joi.ref("params.id"),
                pickup_time: Joi.date().iso(),
                action_id: Joi.number().positive(),
                building_id: Joi.number().positive(),
            }),
        });
    }

    deleteOneValidator(): express.RequestHandler<any> {
        return celebrate({
            params: Joi.object({
                id: Joi.number().positive().required(),
            }),
        });
    }
}
