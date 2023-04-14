import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "../../../mock/src/database";
import { constants } from "http2";

describe("Succesful requests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
    });

    test("Create a new action", async () => {
        const newAction = {
            description: "new action",
        };

        await runner.post("/action", newAction);
    });

    test("Find all actions", async () => {
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

        await runner.get("/action", expected);
    });

    test("Find specific action", async () => {
        const expected = [
            {
                id: 1,
                description: "action 1",
            },
        ];

        await runner.get("/action/1", expected);
    });

    test("Update an action", async () => {
        const newAction = {
            id: 1,
            description: "Updated description",
        };

        await runner.patch("/action/1", newAction);
    });

    test("Delete an action", async () => {
        await runner.delete("/action/3");

        // verify that the action is truly deleted
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

        await runner.get("/action", expected);
    });

    afterEach(async () => {
        await restoreTables("action", "garbage");
    });

    afterAll(() => {
        app.close();
    });
});

describe("Unsuccesful requests", () => {
    let runner: Testrunner;
    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();
    });

    describe("Must be correctly authorized to use any path", () => {
        test("Cannot reach any method without authorisation", async () => {
            // set runner authentication level
            runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
            const expected = {
                message: "Forbidden",
            };

            // collective
            await runner.get(
                "/action",
                [expected],
                constants.HTTP_STATUS_FORBIDDEN,
            );
            // specific
            await runner.get(
                "/action/1",
                [expected],
                constants.HTTP_STATUS_FORBIDDEN,
            );
            const newAction = {
                description: "new action",
            };
            // creating
            await runner.post(
                "/action",
                expected,
                constants.HTTP_STATUS_FORBIDDEN,
            );
            // updating
            await runner.patch("/action/1", newAction);
            // deleting
            await runner.delete("/action/1", constants.HTTP_STATUS_FORBIDDEN);
        });

        test("Find a nonexistent action", async () => {});
    });
});
