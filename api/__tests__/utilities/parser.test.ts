import { describe } from "@jest/globals";
import { Parser } from "../../src/parser";
import { APIError } from "../../src/errors/api_error";
import { APIErrorCode } from "../../src/errors/api_error_code";

describe("Parser tests", () => {
    describe("Parser.bool", () => {
        test("Accept type boolean", () => {
            expect(Parser.bool(true)).toBeTruthy();
            expect(Parser.bool(false)).toBeFalsy();
        });

        test("Accept string booleans", () => {
            expect(Parser.bool("true")).toBeTruthy();
            expect(Parser.bool("false")).toBeFalsy();
        });

        test("Throw BAD REQUEST for invalid value", () => {
            expect(() => Parser.bool("foo")).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Return otherwise if input undefined", () => {
            expect(Parser.bool(undefined, true)).toBeTruthy();
        });
    });

    describe("Parser.number", () => {
        test("Throw BAD_REQUEST if input undefined, but required", () => {
            expect(() => Parser.number(undefined, 0, true)).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Return otherwise if input input undefined, but not required", () => {
            expect(Parser.number(undefined, 0, false)).toEqual(0);
        });

        test("Throw BAD_REQUEST if input is not a number", () => {
            expect(() => Parser.number("foo", 0)).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Return input as number", () => {
            expect(Parser.number("128")).toEqual(128);
        });
    });

    describe("Parser.string", () => {
        test("Return otherwise if input undefined", () => {
            expect(Parser.string(undefined, "otherwise")).toEqual("otherwise");
        });

        test("Return otherwise if input is empty string", () => {
            expect(Parser.string("", "otherwise")).toEqual("otherwise");
        });

        test("Return input if it is not empty", () => {
            expect(Parser.string("foo")).toEqual("foo");
        });
    });

    describe("Parser.date", () => {
        const date: Date = new Date(0);
        test("Return otherwise if input is undefined", () => {
            expect(Parser.date(undefined, date)).toEqual(date);
        });

        test("Throw BAD_REQUEST if invalid date is passed", () => {
            expect(() => Parser.date("foo")).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Parse a valid date", () => {
            expect(Parser.date("1970-01-01T00:00:00.000Z")).toEqual(date);
        });
    });

    describe("Parser.order", () => {
        test("Throw BAD_REQUEST if field lengths are not equal", () => {
            const sort = "foo,bar";
            const ord = "asc";

            expect(() => Parser.order(sort, ord)).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Return empty list if both fields are undefined", () => {
            expect(Parser.order(undefined, undefined)).toEqual([]);
        });

        test("Throw BAD_REQUEST if either field is undefined, but not both", () => {
            expect(() => Parser.order("foo", undefined)).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
            expect(() => Parser.order(undefined, "foo")).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });

        test("Construct a valid object for Prisma orderBy", () => {
            const expected = [
                {
                    foo: "asc",
                },
                {
                    bar: "desc",
                },
            ];

            expect(Parser.order("foo,bar", "asc,desc")).toEqual(expected);
        });

        test("Throw BAD_REQUEST if an order value is not allowed", () => {
            expect(() => Parser.order("foo,bar", "baz,desc")).toThrowError(
                new APIError(APIErrorCode.BAD_REQUEST),
            );
        });
    });
});
