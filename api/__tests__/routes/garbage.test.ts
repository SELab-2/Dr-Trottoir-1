import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase, restoreTables } from "../mock/database";
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
        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Successful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        describe("GET /garbage with different roles", () => {
            const expectedData = [
                {
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
                        description: "Description of building 1",
                        name: "Building 1",
                    },
                    building_id: 1,
                    id: 1,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    description: "action 1",
                },
                {
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
                        description: "Description of building 2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    id: 2,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    description: "action 2",
                },
            ];

            test("GET /garbage as a superstudent", async () => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

                await runner.get({
                    url: "/garbage",
                    expectedData: expectedData,
                });
            });

            test("GET /garbage as a student", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);

                await runner.get({
                    url: "/garbage",
                    expectedData: expectedData,
                });
            });

            test("GET /garbage as a syndicus", async () => {
                runner.authLevel(AuthenticationLevel.SYNDICUS);
                const expectedData = [
                    {
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
                            description: "Description of building 1",
                            name: "Building 1",
                        },
                        building_id: 1,
                        id: 1,
                        pickup_time: "2023-05-04T12:00:00.000Z",
                        description: "action 1",
                    },
                ];

                await runner.get({
                    url: "/garbage?syndicus_id=4",
                    expectedData: expectedData,
                });
            });
        });

        describe("GET /garbage/:id with different roles", () => {
            const expected = [
                {
                    id: 1,
                    pickup_time: "2023-05-04T12:00:00.000Z",
                    description: "action 1",
                    building_id: 1,
                    building: {
                        id: 1,
                        name: "Building 1",
                        ivago_id: "ivago-1",
                        description: "Description of building 1",
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

            test("GET /garbage/:id as superstudent", async () => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
                await runner.get({
                    url: "/garbage/1",
                    expectedData: expected,
                });
            });

            test("GET /garbage/:id as student", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.get({
                    url: "/garbage/1",
                    expectedData: expected,
                });
            });

            test("GET /garbage/:id as syndicus", async () => {
                runner.authLevel(AuthenticationLevel.SYNDICUS);
                await runner.get({
                    url: "/garbage/1",
                    expectedData: expected,
                });
            });
        });

        test("PATCH /garbage/:id", async () => {
            const expected = {
                pickup_time: "2023-02-02T00:00:00.000Z",
                description: "action 1",
                id: 1,
                building_id: 1,
                building: {
                    id: 1,
                    name: "Building 1",
                    ivago_id: "ivago-1",
                    description: "Description of building 1",
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
                description: "action 1",
                building_id: 2,
            };

            const expectedResponse = {
                id: 3,
                pickup_time: "2023-05-04T12:00:00.000Z",
                description: "action 1",
                building_id: 2,
                building: {
                    id: 2,
                    name: "Building 2",
                    ivago_id: "ivago-2",
                    description: "Description of building 2",
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
                description: "action 1",
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
            test("Cannot use any path as Student except GET", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);

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
            test("Cannot use any path as Syndicus except GET with syndicus_id", async () => {
                runner.authLevel(AuthenticationLevel.SYNDICUS);

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

        test("Change building id to non-existent one", async () => {
            await runner.patch({
                url: "/garbage/1",
                data: { building_id: 5 },
                expectedResponse: badRequestForeignKey,
                statusCode: 400,
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
