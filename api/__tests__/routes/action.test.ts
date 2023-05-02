import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    resetDatabase,
    restoreTables,
} from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";

describe("Action tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables("action", "garbage");
    });

    describe("Succesful requests", () => {
        test("POST /action", async () => {
            const newAction = {
                description: "new action",
            };

            await runner.post({
                url: "/action",
                data: newAction,
                expectedResponse: newAction,
            });
        });

        test("GET /action", async () => {
            const expected = [
                { id: 1, description: "action 1" },
                { id: 2, description: "action 2" },
                { id: 3, description: "Unlinked action" },
            ];

            await runner.get({ url: "/action", expectedData: expected });
        });

        test("GET /action/:id", async () => {
            const expected = [{ id: 1, description: "action 1" }];

            await runner.get({ url: "/action/1", expectedData: expected });
        });

        test("PATCH /action/:id", async () => {
            const newAction = {
                id: 1,
                description: "Updated description",
            };

            await runner.patch({
                url: "/action/1",
                data: newAction,
                expectedResponse: newAction,
            });
        });

        test("DELETE /action/:id", async () => {
            await runner.delete({ url: "/action/3" });

            // verify that the action is truly deleted
            const expected = [
                { id: 1, description: "action 1" },
                { id: 2, description: "action 2" },
            ];
            await runner.get({
                url: "/action",
                expectedData: expected,
            });
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
            const newAction = {
                description: "new action",
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /action", async () => {
                    await runner.get({
                        url: "/action",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /action/:id", async () => {
                    await runner.get({
                        url: "/action/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /action", async () => {
                    await runner.post({
                        url: "/action",
                        data: newAction,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /action/:id", async () => {
                    await runner.patch({
                        url: "/action/1",
                        data: newAction,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /action/:id", async () => {
                    await runner.delete({
                        url: "/action/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /action", async () => {
                    await runner.get({
                        url: "/action",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /action/:id", async () => {
                    await runner.get({
                        url: "/action/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /action", async () => {
                    await runner.post({
                        url: "/action",
                        data: newAction,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /action/:id", async () => {
                    await runner.patch({
                        url: "/action/1",
                        data: newAction,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /action/:id", async () => {
                    await runner.delete({
                        url: "/action/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent action", async () => {
                await runner.get({
                    url: "/action/0",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent action", async () => {
                await runner.get({
                    url: "/action/0",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent action", async () => {
                await runner.delete({ url: "/action/0", statusCode: 404 });
            });
        });
        describe("The type of action id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/action/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newAction = {
                    foo: "bar",
                };

                await runner.patch({
                    url: "/action/wrongtype",
                    data: newAction,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/action/wrongtype",
                    statusCode: 400,
                });
            });
        });

        afterAll(() => {
            app.close();
        });
    });
});
