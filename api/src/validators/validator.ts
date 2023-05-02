import { celebrate } from "celebrate";

export abstract class Validator {
    getAllValidator() {
        return celebrate({
            body: {},
        });
    }

    getOneValidator() {
        return celebrate({
            body: {},
        });
    }

    createOneValidator() {
        return celebrate({
            body: {},
        });
    }

    updateOneValidator() {
        return celebrate({
            body: {},
        });
    }

    deleteOneValidator() {
        return celebrate({
            body: {},
        });
    }
}
