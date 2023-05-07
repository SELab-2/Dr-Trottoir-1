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
    notFoundResponse,
} from "../utilities/constants";

describe("Round tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        await deleteDatabaseData();
        await initialiseDatabase();

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        test("POST /round", async () => {
            const newRound = {
                name: "new Round",
            };

            const expected = {
                name: "new Round",
                buildings: [],
            };

            await runner.post({
                url: "/round",
                data: newRound,
                expectedResponse: expected,
            });
        });

        test("GET /round", async () => {
            const expected = [
                {
                    buildings: [
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
                                name: "Building 1",
                            },
                            building_id: 1,
                            deleted: false,
                            id: 1,
                            round_id: 1,
                        },
                    ],
                    id: 1,
                    name: "Round 1",
                },
                {
                    buildings: [
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
                                name: "Building 2",
                            },
                            building_id: 2,
                            deleted: false,
                            id: 2,
                            round_id: 2,
                        },
                    ],
                    id: 2,
                    name: "Round 2",
                },
            ];

            await runner.get({ url: "/round", expectedData: expected });
        });

        test("GET /round/:id", async () => {
            const expected = [
                {
                    buildings: [
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
                                name: "Building 1",
                            },
                            building_id: 1,
                            deleted: false,
                            id: 1,
                            round_id: 1,
                        },
                    ],
                    id: 1,
                    name: "Round 1",
                },
            ];

            await runner.get({ url: "/round/1", expectedData: expected });
        });

        test("PATCH /round/:id", async () => {
            const newRound = {
                name: "Updated Round 1",
            };

            const expected = {
                buildings: [
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
                            name: "Building 1",
                        },
                        building_id: 1,
                        deleted: false,
                        id: 1,
                        round_id: 1,
                    },
                ],
                id: 1,
                name: "Updated Round 1",
            };

            await runner.patch({
                url: "/round/1",
                data: newRound,
                expectedResponse: expected,
            });
        });

        test("DELETE /round/:id", async () => {
            await runner.delete({ url: "/round/1" });

            // verify that the round is truly deleted
            const expected = [
                {
                    buildings: [
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
                                name: "Building 2",
                            },
                            building_id: 2,
                            deleted: false,
                            id: 2,
                            round_id: 2,
                        },
                    ],
                    id: 2,
                    name: "Round 2",
                },
            ];
            await runner.get({
                url: "/round",
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
            const newRound = {
                name: "new Round",
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /round", async () => {
                    await runner.get({
                        url: "/round",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /round/:id", async () => {
                    await runner.get({
                        url: "/round/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /round", async () => {
                    await runner.post({
                        url: "/round",
                        data: newRound,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /round/:id", async () => {
                    await runner.patch({
                        url: "/round/1",
                        data: newRound,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /round/:id", async () => {
                    await runner.delete({
                        url: "/round/1",
                        statusCode: 403,
                    });
                });
            });

            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /round", async () => {
                    await runner.get({
                        url: "/round",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /round", async () => {
                    await runner.post({
                        url: "/round",
                        data: newRound,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /round/:id", async () => {
                    await runner.patch({
                        url: "/round/1",
                        data: newRound,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /round/:id", async () => {
                    await runner.delete({
                        url: "/round/1",
                        statusCode: 403,
                    });
                });
            });
        });

        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent round", async () => {
                await runner.get({
                    url: "/round/6",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent round", async () => {
                const newRound = {
                    name: "Updated Round 0",
                };

                await runner.patch({
                    url: "/round/6",
                    data: newRound,
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent round", async () => {
                await runner.delete({ url: "/round/9", statusCode: 404 });
            });
        });

        describe("The type of round id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/round/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newRound = {
                    foo: "false new Round",
                };

                await runner.patch({
                    url: "/round/wrongtype",
                    data: newRound,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/round/wrongtype",
                    statusCode: 400,
                });
            });
        });

        afterAll(() => {
            app.close();
        });
    });
});
