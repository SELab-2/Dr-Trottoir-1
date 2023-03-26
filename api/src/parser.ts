import { APIError } from "./errors/api_error";
import { APIErrorCode } from "./errors/api_error_code";

/**
 * Exports a bunch of serializers which will read a value and either parse it
 * correctly or return an `otherwise` object (which is undefined by default).
 */
export class Parser {
    static bool(
        input: string | undefined,
        otherwise: boolean | undefined = undefined,
    ): boolean | undefined {
        if (input === "true") {
            return true;
        } else if (input === "false") {
            return false;
        } else if (input) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        } else {
            return otherwise;
        }
    }

    static number(
        input: string | undefined,
        otherwise: number | undefined = undefined,
        required = false,
    ): number | undefined {
        if (input === undefined) {
            if (required) {
                throw new APIError(APIErrorCode.BAD_REQUEST);
            } else {
                return otherwise;
            }
        }

        const result = Number(input);

        if (Number.isNaN(result)) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return result;
    }

    static stringArray(
        input: string | undefined,
        otherwise: string[] | undefined = undefined,
    ): string[] | undefined {
        return input?.split(",") ?? otherwise;
    }

    static string(
        input: string | undefined,
        otherwise: string | undefined = undefined,
    ): string | undefined {
        if (!input) {
            return otherwise;
        } else if (input.length > 0) {
            return input;
        } else {
            return otherwise;
        }
    }

    static date(
        input: string | undefined,
        otherwise: Date | undefined = undefined,
    ): Date | undefined {
        if (!input) {
            return otherwise;
        }

        const result = new Date(input);

        if (result.toString() === "Invalid Date") {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return result;
    }

    /***
     * Construct a list of objects for Prisma to order on
     * List is constructed pair-wise:
     *      Parser.order([a,b,c], [1,2,3]) will result in [{a: 1}, {b: 2}, {c: 3}]
     * Prisma orders front to back, so fields that should be sorted on first should be at the front of the list
     * @param sort_fields fields to sort on
     * @param order_fields order the fields are supposed to have
     * @return a list of objects for Prisma to use in orderBy query option
     */
    static order(
        sort_fields: string | undefined,
        order_fields: string | undefined,
    ): object[] {
        const allowedOrderValues = ["desc", "asc"]; // these are the values allowed by Prisma
        const sort_fields_separated = sort_fields?.split(",");
        const order_fields_separated = order_fields?.split(",");

        // if there's no fields to sort on, return empty list
        // In this case, Prisma will return the elements as recorded in the database
        if (sort_fields_separated === undefined) {
            return [];
        }

        const out = [];
        for (let i = 0; i < sort_fields_separated.length; i++) {
            const field = sort_fields_separated[i];
            let sortOrder;
            if (order_fields_separated === undefined) {
                sortOrder = "desc"; // default value
            } else {
                sortOrder = order_fields_separated[i];
                // if an invalid value is given, skip that field
                if (!allowedOrderValues.includes(sortOrder)) {
                    continue;
                }
            }

            out.push({ [field]: sortOrder });
        }

        return out;
    }
}
