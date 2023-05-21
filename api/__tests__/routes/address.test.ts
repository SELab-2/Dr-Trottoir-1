import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import {
    deleteDatabaseData,
    initialiseDatabase,
    restoreTables,
} from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    methodNotAllowedResponse,
    notFoundResponse,
} from "../utilities/constants";

describe("Address tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);
        runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
    });

    beforeEach(async () => {
        await deleteDatabaseData();
        await initialiseDatabase();
    });

    afterAll(async () => {
        await deleteDatabaseData();
        await initialiseDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("POST /address", async () => {
            const value = {
                street: "Straatnaam",
                longitude: 0.0,
                city: "Gent",
                number: 64,
                latitude: 0.0,
                zip_code: 2500,
            };
            const expected = {
                id: 5,
                street: "Straatnaam",
                longitude: 0.0,
                city: "Gent",
                number: 64,
                latitude: 0.0,
                zip_code: 2500,
            };

            await runner.post({
                url: "/address",
                data: value,
                expectedResponse: expected,
            });
        });

        test("GET /address/:id", async () => {
            const expected = [
                {
                    id: 1,
                    street: "Wallaby Way",
                    number: 42,
                    city: "Sydney",
                    zip_code: 2000,
                    latitude: -33.865143,
                    longitude: 151.2099,
                },
            ];

            await runner.get({ url: "/address/1", expectedData: expected });
        });

        test("PATCH /address/:id", async () => {
            const expected = {
                street: "Wallaby Way",
                number: 42,
                city: "Gent",
                zip_code: 2000,
                latitude: -33.865143,
                longitude: 151.2099,
                id: 1,
            };

            await runner.patch({
                url: "/address/1",
                data: { city: "Gent" },
                expectedResponse: expected,
            });
        });

        test("DELETE /address/:id", async () => {
            await runner.delete({ url: "/address/4" });
            //verify that the address is truly deleted (no getAll method)
            await runner.get({
                url: "/address/4",
                expectedData: [notFoundResponse],
                statusCode: 404,
            });
        });

        test("PATCH /address/:id (Student own address)", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            const expected = {
                street: "Wallaby Way",
                number: 42,
                city: "Gent",
                zip_code: 2000,
                latitude: -33.865143,
                longitude: 151.2099,
                id: 1,
            };

            await runner.patch({
                url: "/address/1",
                data: { city: "Gent" },
                expectedResponse: expected,
            });
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
            const newAddress = {
                street: "Krijgslaan",
                number: 2,
                city: "Ghent",
                zip_code: 9000,
                latitude: 51.02776,
                longitude: 3.71847,
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /address", async () => {
                    await runner.get({
                        url: "/address",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /address/:id", async () => {
                    await runner.get({
                        url: "/address/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /address", async () => {
                    await runner.post({
                        url: "/address",
                        data: newAddress,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /address/:id", async () => {
                    await runner.patch({
                        url: "/address/1",
                        data: newAddress,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /address/:id", async () => {
                    await runner.delete({
                        url: "/address/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /address", async () => {
                    await runner.get({
                        url: "/address",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /address", async () => {
                    await runner.post({
                        url: "/address",
                        data: newAddress,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("PATCH /address/:id (not own address)", async () => {
                    const expected = {
                        street: "Wallaby Way",
                        number: 42,
                        city: "Gent",
                        zip_code: 2000,
                        latitude: -33.865143,
                        longitude: 151.2099,
                        id: 1,
                    };

                    await runner.patch({
                        url: "/address/2",
                        data: { city: "Gent" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /address/:id", async () => {
                    await runner.delete({
                        url: "/address/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent address", async () => {
                await runner.get({
                    url: "/address/1000",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent address", async () => {
                const newAddress = {
                    street: "Krijgslaan",
                    number: 2,
                };
                await runner.patch({
                    url: "/address/1000",
                    data: newAddress,
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent address", async () => {
                await runner.delete({ url: "/address/1000", statusCode: 404 });
            });
        });
        describe("The type of address id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/address/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newAddress = {
                    street: "Krijgslaan",
                    number: 2,
                    city: "Ghent",
                    zip_code: 9000,
                    latitude: 51.02776,
                    longitude: 3.71847,
                };

                await runner.patch({
                    url: "/address/wrongtype",
                    data: newAddress,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/address/wrongtype",
                    statusCode: 400,
                });
            });
        });
        describe("The type of address id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });
            test("Cannot reach GET /address", async () => {
                await runner.get({
                    url: "/address",
                    expectedData: [methodNotAllowedResponse],
                    statusCode: 405,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
