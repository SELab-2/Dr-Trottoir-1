/**
 * File showing off the usage of Testrunner
 * action.test.js is taken as a template for this test suite
 */
import { AuthenticationLevel, Testrunner } from "./utilities/Testrunner";
import request from "supertest";
import app from "../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
} from "./utilities/database.utility";

describe("Example test suite", () => {
    let testRunner: Testrunner;
    beforeAll(async () => {
        // clean the database
        await deleteDatabaseData();
        await initialiseDatabase();

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

    test("Example POST", async () => {
        const newAction = {
            description: "new action",
        };

        await testRunner.post(
            "/action",
            newAction,
            AuthenticationLevel.ADMINISTRATOR,
        );
    });

    test("Example PATCH", async () => {
        const updatedAction = {
            id: 1,
            description: "Update!",
        };
        await testRunner.patch(
            "/action/1",
            updatedAction,
            AuthenticationLevel.ADMINISTRATOR,
        );
    });

    test("Example DELETE", async () => {
        await testRunner.delete("/action/3", AuthenticationLevel.ADMINISTRATOR);
    });

    afterAll(() => {
        app.close();
    });
});
