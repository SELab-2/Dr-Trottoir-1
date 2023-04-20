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
    restoreTables,
} from "./mock/database";

describe("Example test suite", () => {
    let testRunner: Testrunner;

    /**
     * Acquire a reference to the server and create the Testrunner
     * Also set the whole database up cleanly ONCE
     */
    beforeAll(async () => {
        const server = request(app);
        testRunner = new Testrunner(server);

        // clean the database
        await deleteDatabaseData();
        await initialiseDatabase();

        // set the authentication level the runner should execute under
        // This can also be set in the beforeEach hook, depending on your test suite
        testRunner.authLevel(AuthenticationLevel.ADMINISTRATOR);
    });

    test("Example GET", async () => {
        // define values that are expected from GET /action
        const expected = [
            { id: 1, description: "action 1" },
            { id: 2, description: "action 2" },
        ];

        // let the runner run
        await testRunner.get({
            url: "/action",
            expectedData: expected,
        });
    });

    test("Example POST", async () => {
        const newAction = {
            description: "new action",
        };

        await testRunner.post({
            url: "/action",
            data: newAction,
            expectedResponse: newAction,
        });

        // clean up after ourselves
        await restoreTables("action");
    });

    test("Example PATCH", async () => {
        const updatedAction = {
            id: 1,
            description: "Update!",
        };

        await testRunner.patch({
            url: "/action/1",
            data: updatedAction,
            // for succesful PATCH requests, expectedResponse should be equal to data
            // for PATCH requests that are expected to fail, provide the expected response
            expectedResponse: updatedAction,
        });
    });

    test("Example DELETE", async () => {
        // first delete garbage that is connected to this action, then action itself
        await testRunner.delete({
            url: "/garbage/2",
        });

        await testRunner.delete({ url: "/action/2" });
    });

    afterEach(async () => {
        // clean up after ourselves
        // The tests must be kept idempotent => make sure you restore all tables you (might) have changed!
        // Also be very careful with the order of the restoration of tables!
        await restoreTables("action", "garbage");
    });

    afterAll(() => {
        // close the app to release all resources
        app.close();
    });
});
