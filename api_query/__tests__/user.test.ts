import { UserQuery } from "../src/user";

describe("user", () => {
    it("", () => {
        const target =
            "/user?take=0&skip=5&added_after=1970-01-01T00:00:00.000Z&added_before=1970-01-01T00:00:00.000Z&admin=true&student=true&super_student=true&login_before=1970-01-01T00:00:00.000Z&name=Bob&login_after=1970-01-01T00:00:00.000Z&";
        const date = new Date("1970-01-01");

        const url = new UserQuery().url({
            take: 0,
            skip: 5,
            added_after: date,
            added_before: date,
            admin: true,
            student: true,
            super_student: true,
            login_before: date,
            name: "Bob",
            login_after: date,
        });

        expect(url).toEqual(target);
    });
});
