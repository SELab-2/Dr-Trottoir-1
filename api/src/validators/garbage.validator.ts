import { Validator } from "./validator";
import express from "express";
import { celebrate } from "celebrate";
import Joi from "joi";

export class GarbageValidator extends Validator {
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
