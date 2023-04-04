import { GarbageQuery } from "../src/garbage";

describe("garbage", () => {
    it("", () => {
        const target =
            "/garbage?take=0&skip=5&before=1970-01-01T00:00:00.000Z&after=1970-01-01T00:00:00.000Z&";
        const date = new Date("1970-01-01");

        const url = new GarbageQuery().url({
            take: 0,
            skip: 5,
            before: date,
            after: date,
        });

        expect(url).toEqual(target);
    });
});
