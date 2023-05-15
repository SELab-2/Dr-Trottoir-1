import { QueryError } from "../src";

describe("QueryError", () => {
    it("", () => {
        const e = new QueryError(200, "TEST");
        expect(e instanceof QueryError).toBe(true);
    });
});
