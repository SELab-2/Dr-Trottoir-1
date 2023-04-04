import { Query } from "../src/query";

describe("garbage", () => {
    type Type = {
        key: string;
        date: Date;
        sort: string[];
        ord: Array<"asc" | "desc">;
    };

    class QueryTest extends Query<Type, never> {
        endpoint = "endpoint";
    }

    it("Simple", () => {
        const url = new QueryTest().url({
            key: "value",
        });

        expect(url).toEqual("/endpoint?key=value&");
    });

    it("Sorting and ordering", () => {
        const url = new QueryTest().url({
            sort: ["col1", "col2"],
            ord: ["asc", "desc"],
        });

        expect(url).toEqual("/endpoint?sort=col1,col2&ord=asc,desc&");
    });

    it("Dates", () => {
        const date = new Date("1970-01-01");

        const url = new QueryTest().url({
            date: date,
        });

        expect(url).toEqual("/endpoint?date=1970-01-01T00:00:00.000Z&");
    });
});
