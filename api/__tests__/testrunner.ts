// @ts-ignore
// @ts-ignore
import supertest from "supertest";
// @ts-ignore
import request, { Response } from "supertest";
import app from "../src/main";
import assert = require("assert");

/**
 * Testrunner will run the requests and verify that they match the specification
 * Use this instead of verifying the fields yourself.
 */
export class Testrunner {
    session: supertest.SuperTest<any>;

    private constructor(session: supertest.SuperTest<any>) {
        this.session = session;
    }

    static async newInstance(): Promise<Testrunner> {
        const session = request(app);
        const login = await session.post("/auth/login").send({
            username: "administrator@trottoir.be",
            password: "password",
        });

        // sanity checks
        assert(login.status === 302);
        assert(login.headers["set-cookie"]);

        return new Testrunner(session);
    }

    close = () => {
        app.close();
    };

    get = async (url: string, expectedData: {}[]) => {
        const result: Response = await this.session.get(url);
        console.log(JSON.stringify(result.body));
    };

    post = async (url: string, data: object) => {
        const result: Response = await this.session.post(url).send(data);

        expect(result).toBeDefined();
        expect(result.ok).toBeTruthy();

        // when verifying that we received the same data back, we can impossibly have given the correct id
        // therefore, we just delete it
        delete result.body["id"];
        expect(result.body).toEqual(data);

        return result;
    };

    patch = async (url: string, object: {}) => {};

    delete = async (url: string, object: {}) => {};

    getFail = async (url: string, error_code: number) => {};
}
