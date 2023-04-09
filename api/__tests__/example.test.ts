/**
 * File showing off the usage of Testrunner
 */
import { AuthenticationLevel, Testrunner } from "./utilities/Testrunner";
import request from "supertest";
import app from "../src/main";

let testRunner: Testrunner;
describe("Example test suite", () => {
    beforeAll(async () => {
        const server = request(app);
        testRunner = new Testrunner(server);
    });

    test("Example GET", async () => {
        const expected = [
            {
                id: 1,
                description: "action 1",
            },
            {
                id: 2,
                description: "action 2",
            },
        ];

        await testRunner.get(
            "/action",
            expected,
            AuthenticationLevel.ADMINISTRATOR,
        );
    });

    test("Example GET unauthorised", async () => {});

    afterAll(() => {
        app.close();
    });
});
