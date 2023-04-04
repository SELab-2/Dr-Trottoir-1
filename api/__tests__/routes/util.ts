// @ts-ignore
import request from "supertest";
// @ts-ignore
import supertest from "supertest";
import app from "../../src/main";
import assert = require("assert");

export async function obtainSession(): Promise<[supertest.SuperTest<[any]>]> {
    const session = request(app);
    const login = await session.post("/auth/login").send({
        username: "administrator@trottoir.be",
        password: "password",
    });

    // sanity checks
    assert(login.status === 302);
    assert(login.headers["set-cookie"]);

    return [session];
}
