import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { deleteDatabaseData, initialiseDatabase } from "../mock/database";
import {
    badRequestForeignKey,
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";

// turn authentication on, no matter what
process.env["DISABLE_AUTH"] = "false";
describe("Garbage tests", () => {
    let runner: Testrunner;
    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
    });

    /**
     * Positive tests on the API.
     */
    describe("Successful requests", () => {
        beforeAll(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });
        test("GET /garbage", async () => {
            const expectedData = [
                {
                    action: { description: "action 1", id: 1 },
                    action_id: 1,
                    building: {
                        address: {
                            city: "Sydney",
                            id: 1,
                            latitude: -33.865143,
                            longitude: 151.2099,
                            number: 42,
                            street: "Wallaby Way",
                            zip_code: 2000,
                        },
                        deleted: false,
                        id: 1,
                        ivago_id: "ivago-1",
                        name: "Building 1",
                    },
                    building_id: 1,
                    id: 1,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                },
                {
                    action: { description: "action 2", id: 2 },
                    action_id: 2,
                    building: {
                        address: {
                            city: "Ghent",
                            id: 2,
                            latitude: 51.04732,
                            longitude: 3.7282,
                            number: 25,
                            street: "Sint-Pietersnieuwstraat",
                            zip_code: 9000,
                        },
                        deleted: false,
                        id: 2,
                        ivago_id: "ivago-2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    id: 2,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                },
            ];

            await runner.get({
                url: "/garbage",
                expectedData: expectedData,
            });
        });
        test("GET /garbage/:id", async () => {
            const expected = [
                {
                    id: 1,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    action_id: 1,
                    building_id: 1,
                    action: { id: 1, description: "action 1" },
                    building: {
                        id: 1,
                        name: "Building 1",
                        ivago_id: "ivago-1",
                        deleted: false,
                        address: {
                            id: 1,
                            street: "Wallaby Way",
                            number: 42,
                            city: "Sydney",
                            zip_code: 2000,
                            latitude: -33.865143,
                            longitude: 151.2099,
                        },
                    },
                },
            ];
            await runner.get({
                url: "/garbage/1",
                expectedData: expected,
            });
        });

        test("PATCH /garbage/:id", async () => {
            const expected = {
                pickup_time: "2023-02-02T00:00:00.000Z",
                action_id: 1,
                building_id: 1,
                action: { id: 1, description: "action 1" },
                building: {
                    id: 1,
                    name: "Building 1",
                    ivago_id: "ivago-1",
                    deleted: false,
                    address: {
                        id: 1,
                        street: "Wallaby Way",
                        number: 42,
                        city: "Sydney",
                        zip_code: 2000,
                        latitude: -33.865143,
                        longitude: 151.2099,
                    },
                },
            };
            await runner.patch({
                url: "/garbage/1",
                data: { pickup_time: "2023-02-02T00:00:00.000Z" },
                expectedResponse: expected,
            });
        });

        test("POST /garbage", async () => {
            const newGarbage = {
                pickup_time: "2023-05-04T12:00:00.000Z",
                action_id: 1,
                building_id: 2,
            };

            const expectedResponse = {
                pickup_time: "2023-05-04T12:00:00.000Z",
                action_id: 1,
                building_id: 2,
                action: { id: 1, description: "action 1" },
                building: {
                    id: 2,
                    name: "Building 2",
                    ivago_id: "ivago-2",
                    deleted: false,
                    address: {
                        id: 2,
                        street: "Sint-Pietersnieuwstraat",
                        number: 25,
                        city: "Ghent",
                        zip_code: 9000,
                        latitude: 51.04732,
                        longitude: 3.7282,
                    },
                },
            };
            await runner.post({
                url: "/garbage",
                data: newGarbage,
                expectedResponse: expectedResponse,
            });
        });
    });

    /**
     * Negative tests on the API.
     */
    describe("Unsuccessful requests", () => {
        describe("Authentication tests", () => {
            const garbage = {
                pickup_time: new Date(2023, 5, 3, 0, 0, 0),
                action_id: 1,
                building_id: 1,
            };
            test("Cannot use any path as unauthorized", async () => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                await runner.get({
                    url: "/garbage",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.get({
                    url: "/garbage/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/garbage",
                    data: garbage,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/garbage/1",
                    data: garbage,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/garbage/1",
                    statusCode: 403,
                });
            });
            test("Cannot use any path as Student except specific GET", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.get({
                    url: "/garbage",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/garbage",
                    data: garbage,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/garbage/1",
                    data: garbage,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/garbage/1",
                    statusCode: 403,
                });
            });
        });

        describe("Cannot reference a non-existent garbage", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Can't GET a non-existent garbage", async () => {
                await runner.get({
                    url: "/garbage/5",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });
            test("Can't PATCH a non-existent garbage", async () => {
                await runner.patch({
                    url: "/garbage/5",
                    data: { pickup_time: "2023-05-04T12:00:00.000Z" },
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Can't DELETE a non-existent garbage", async () => {
                await runner.delete({
                    url: "/garbage/5",
                    statusCode: 404,
                });
            });
        });

        test("Cannot assign a wrong type to a field", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.patch({
                url: "/garbage/1",
                // UNIX timestamp
                data: { pickup_time: 1682538300 },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });
        });

        test("Change action id to non-existent one", async () => {
            await runner.patch({
                url: "/garbage/1",
                data: { action_id: 5 },
                expectedResponse: badRequestForeignKey,
                statusCode: 400,
            });
        });

        test("Change building id to non-existent one", async () => {
            await runner.patch({
                url: "/garbage/1",
                data: { building_id: 5 },
                expectedResponse: badRequestForeignKey,
                statusCode: 400,
            });
        });
    });

    /**
     * Negative tests on the validation framework.
     */
    describe("Validation tests", () => {
        describe("GET validations", () => {
            test("Parameter id must have correct type", async () => {
                await runner.get({
                    url: "/garbage/bogus",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("Parameter id must be a positive number", async () => {
                await runner.get({
                    url: "/garbage/0",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });
        });

        describe("POST validations", () => {
            test("pickup_time must be an ISO formatted string", async () => {
                const garbage = {
                    pickup_time: "Non ISO string",
                    action_id: 1,
                    building_id: 1,
                };
                await runner.post({
                    url: "/garbage",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("building_id must be a positive integer", async () => {
                const garbage = {
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    action_id: 1,
                    building_id: "bogus",
                };

                await runner.post({
                    url: "/garbage",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("pickup_time, action_id, and building_id  must all be present", async () => {
                const garbage = {
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    action_id: "bogus",
                    building_id: 1,
                };

                await runner.post({
                    url: "/garbage",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });

        describe("PATCH validations", () => {
            test("pickup_time must be an ISO formatted string", async () => {
                const garbage = {
                    pickup_time: "Non ISO string",
                };
                await runner.patch({
                    url: "/garbage/1",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("action_id must be a positive integer", async () => {
                const garbage = {
                    action_id: "bogus",
                };

                await runner.patch({
                    url: "/garbage/1",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("building_id must be a positive integer", async () => {
                const garbage = {
                    building_id: "bogus",
                };

                await runner.patch({
                    url: "/garbage/1",
                    data: garbage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });

        describe("DELETE validations", () => {
            test("Parameter id must be a positive integer", async () => {
                await runner.delete({
                    url: "/garbage/0",
                    statusCode: 400,
                });

                await runner.delete({
                    url: "/garbage/bogus",
                    statusCode: 400,
                });
            });
        });
    });
    afterAll(() => {
        app.close();
    });
});
