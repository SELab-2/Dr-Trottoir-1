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
import { date } from "date-arithmetic";

describe("Round_building tests", () => {
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

    describe("Succesful requests", () => {
        test("POST /round_building", async () => {
            const newRoundBuilding = {
                round_id: 1,
                building_id: 2,
            };

            const expected = {
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
                    description: "Description of building 2",
                    id: 2,
                    ivago_id: "ivago-2",
                    name: "Building 2",
                },
                building_id: 2,
                deleted: false,
                round: {
                    id: 1,
                    name: "Round 1",
                    description: "Description of round 1",
                },
                round_id: 1,
            };
            await runner.post({
                url: "/round_building",
                data: newRoundBuilding,
                expectedResponse: expected,
            });
        });

        test("GET /roud_building", async () => {
            const expected = [
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
                        description: "Description of building 1",
                        id: 1,
                        ivago_id: "ivago-1",
                        name: "Building 1",
                    },
                    building_id: 1,
                    deleted: false,
                    id: 1,
                    round: {
                        description: "Description of round 1",
                        id: 1,
                        name: "Round 1",
                    },
                    round_id: 1,
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
                        description: "Description of building 2",
                        id: 2,
                        ivago_id: "ivago-2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    deleted: false,
                    id: 2,
                    round: {
                        description: "Description of round 2",
                        id: 2,
                        name: "Round 2",
                    },
                    round_id: 2,
                },
            ];

            await runner.get({
                url: "/round_building",
                expectedData: expected,
            });
        });

        test("GET /round_building/:id", async () => {
            const expected = [
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
                    deleted: false,
                    id: 1,
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                    },
                    round_id: 1,
                },
            ];

            await runner.get({
                url: "/round_building/1",
                expectedData: expected,
            });
        });

        test("PATCH /round_building/:id", async () => {
            const newRoundBuilding = {
                round_id: 2,
            };

            const expected = {
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
                deleted: false,
                id: 1,
                round: {
                    id: 2,
                    name: "Round 2",
                    description: "Description of round 2",
                },
                round_id: 2,
            };

            await runner.patch({
                url: "/round_building/1",
                data: newRoundBuilding,
                expectedResponse: expected,
            });
        });

        test("DELETE /round_building/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const hardRoundBuilding = {
                hardDelete: true,
            };
            await runner.delete({
                url: "/round_building/1",
                data: hardRoundBuilding,
            });

            // verify that the round_building is truly deleted
            const expected = [
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
                        description: "Description of building 2",
                        id: 2,
                        ivago_id: "ivago-2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    deleted: false,
                    id: 2,
                    round: {
                        description: "Description of round 2",
                        id: 2,
                        name: "Round 2",
                    },
                    round_id: 2,
                },
            ];
            await runner.get({
                url: "/round_building?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /round_building/:id (super-student)", async () => {
            await runner.delete({
                url: "/round_building/1",
            });

            // verify that the round_building is truly deleted
            const expected = [
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
                        description: "Description of building 2",
                        id: 2,
                        ivago_id: "ivago-2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    deleted: false,
                    id: 2,
                    round: {
                        description: "Description of round 2",
                        id: 2,
                        name: "Round 2",
                    },
                    round_id: 2,
                },
            ];
            await runner.get({
                url: "/round_building",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /round_building/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({ url: "/round_building/1" });

            // verify that the round_building is truly soft deleted
            const expected = [
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
                        description: "Description of building 1",
                        id: 1,
                        ivago_id: "ivago-1",
                        name: "Building 1",
                    },
                    building_id: 1,
                    deleted: true,
                    id: 1,
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                    },
                    round_id: 1,
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
                        description: "Description of building 2",
                        id: 2,
                        ivago_id: "ivago-2",
                        name: "Building 2",
                    },
                    building_id: 2,
                    deleted: false,
                    id: 2,
                    round: {
                        id: 2,
                        name: "Round 2",
                        description: "Description of round 2",
                    },
                    round_id: 2,
                },
            ];
            await runner.get({
                url: "/round_building?deleted=true",
                expectedData: expected,
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
            const newRoundBuilding = {
                round_id: 1,
                building_id: 2,
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /round_building", async () => {
                    await runner.get({
                        url: "/round_building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /round_building/:id", async () => {
                    await runner.get({
                        url: "/round_building/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /round_building", async () => {
                    await runner.post({
                        url: "/round_building",
                        data: newRoundBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /round_building/:id", async () => {
                    await runner.patch({
                        url: "/round_building/1",
                        data: newRoundBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /round_building/:id", async () => {
                    await runner.delete({
                        url: "/round_building/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /round_building", async () => {
                    await runner.get({
                        url: "/round_building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /round_building/:id", async () => {
                    await runner.get({
                        url: "/round_building/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /round_building", async () => {
                    await runner.post({
                        url: "/round_building",
                        data: newRoundBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /round_building/:id", async () => {
                    await runner.patch({
                        url: "/round_building/1",
                        data: newRoundBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /round_building/:id", async () => {
                    await runner.delete({
                        url: "/round_building/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent round_building", async () => {
                await runner.get({
                    url: "/round_building/100",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent round_building", async () => {
                const newRoundBuilding = {
                    round_id: 1,
                    building_id: 2,
                };
                await runner.patch({
                    url: "/round_building/100",
                    data: newRoundBuilding,
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent round_building", async () => {
                await runner.delete({
                    url: "/round_building/100",
                    statusCode: 404,
                });
            });
        });
        describe("The type of round_building id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/round_building/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newRoundBuilding = {
                    fout: "fout",
                };

                await runner.patch({
                    url: "/round_building/wrongtype",
                    data: newRoundBuilding,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/round_building/wrongtype",
                    statusCode: 400,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
