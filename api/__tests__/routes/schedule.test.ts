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

describe("Schedule tests", () => {
    let runner: Testrunner;

    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Successful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        const schedule = {
            day: "2023-05-04T12:00:00.000Z",
            start: "2023-05-04T12:10:00.000Z",
            end: "2023-05-04T12:20:00.000Z",
            deleted: false,
            id: 1,
            round: {
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
                            description: "Description of building 1",
                            name: "Building 1",
                        },
                        building_id: 1,
                        deleted: false,
                        id: 1,
                        round_id: 1,
                    },
                ],
                deleted: false,
                id: 1,
                name: "Round 1",
                description: "Description of round 1",
            },
            round_id: 1,
            user: {
                address: {
                    city: "Sydney",
                    id: 1,
                    latitude: -33.865143,
                    longitude: 151.2099,
                    number: 42,
                    street: "Wallaby Way",
                    zip_code: 2000,
                },
                address_id: 1,
                admin: false,
                date_added: "2023-05-04T12:00:00.000Z",
                deleted: false,
                email: "student@trottoir.be",
                first_name: "Dirk",
                id: 1,
                last_login: "2023-05-04T12:00:00.000Z",
                last_name: "De Student",
                phone: "0123456789",
                student: true,
                super_student: false,
            },
            user_id: 1,
        };

        test("GET /schedule", async () => {
            const schedules = [
                {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    end: "2023-05-04T12:20:00.000Z",
                    id: 1,
                    round: {
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
                                    description: "Description of building 1",
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
                        deleted: false,
                        description: "Description of round 1",
                        id: 1,
                        name: "Round 1",
                    },
                    round_id: 1,
                    start: "2023-05-04T12:10:00.000Z",
                    user: {
                        address: {
                            city: "Sydney",
                            id: 1,
                            latitude: -33.865143,
                            longitude: 151.2099,
                            number: 42,
                            street: "Wallaby Way",
                            zip_code: 2000,
                        },
                        address_id: 1,
                        admin: false,
                        date_added: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        email: "student@trottoir.be",
                        first_name: "Dirk",
                        id: 1,
                        last_login: "2023-05-04T12:00:00.000Z",
                        last_name: "De Student",
                        phone: "0123456789",
                        student: true,
                        super_student: false,
                    },
                    user_id: 1,
                },
                {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    end: "2023-05-04T12:20:00.000Z",
                    id: 2,
                    round: {
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
                                    description: "Description of building 2",
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
                        deleted: false,
                        description: "Description of round 2",
                        id: 2,
                        name: "Round 2",
                    },
                    round_id: 2,
                    start: "2023-05-04T12:10:00.000Z",
                    user: {
                        address: {
                            city: "Ghent",
                            id: 2,
                            latitude: 51.04732,
                            longitude: 3.7282,
                            number: 25,
                            street: "Sint-Pietersnieuwstraat",
                            zip_code: 9000,
                        },
                        address_id: 2,
                        admin: false,
                        date_added: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        email: "superstudent@trottoir.be",
                        first_name: "Toon",
                        id: 2,
                        last_login: "2023-05-04T12:00:00.000Z",
                        last_name: "De Superstudent",
                        phone: "9876543210",
                        student: false,
                        super_student: true,
                    },
                    user_id: 2,
                },
            ];

            await runner.get({
                url: "/schedule",
                expectedData: schedules,
            });
        });

        test("GET /schedule/:id", async () => {
            await runner.get({
                url: "/schedule/1",
                expectedData: [schedule],
            });
        });

        test("GET /schedule/:id as Student", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            await runner.get({
                url: "/schedule/1",
                expectedData: [schedule],
            });
        });

        test("POST /schedule", async () => {
            const newSchedule = {
                day: new Date(Date.UTC(2023, 5, 4, 12, 0, 0)),
                user_id: 1,
                round_id: 2,
                start: new Date(Date.UTC(2023, 4, 4, 12, 10, 0)),
                end: new Date(Date.UTC(2023, 4, 4, 12, 20, 0)),
            };

            const expectedResponse = {
                id: 3,
                day: "2023-06-04T12:00:00.000Z",
                start: "2023-05-04T12:10:00.000Z",
                end: "2023-05-04T12:20:00.000Z",
                user_id: 1,
                round_id: 2,
                deleted: false,
                user: {
                    id: 1,
                    email: "student@trottoir.be",
                    first_name: "Dirk",
                    last_name: "De Student",
                    last_login: "2023-05-04T12:00:00.000Z",
                    date_added: "2023-05-04T12:00:00.000Z",
                    phone: "0123456789",
                    address_id: 1,
                    address: {
                        id: 1,
                        street: "Wallaby Way",
                        number: 42,
                        city: "Sydney",
                        zip_code: 2000,
                        latitude: -33.865143,
                        longitude: 151.2099,
                    },
                    student: true,
                    super_student: false,
                    admin: false,
                    deleted: false,
                },
                round: {
                    id: 2,
                    name: "Round 2",
                    deleted: false,
                    description: "Description of round 2",
                    buildings: [
                        {
                            id: 2,
                            round_id: 2,
                            building_id: 2,
                            deleted: false,
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
                        },
                    ],
                },
            };

            await runner.post({
                url: "/schedule",
                data: newSchedule,
                expectedResponse: expectedResponse,
            });
        });
        test("PATCH /schedule/:id", async () => {
            const response = {
                id: 1,
                day: "2023-05-04T12:00:00.000Z",
                start: "2023-05-04T12:10:00.000Z",
                end: "2023-05-04T12:20:00.000Z",
                user_id: 2,
                round_id: 1,
                deleted: false,
                user: {
                    id: 2,
                    email: "superstudent@trottoir.be",
                    first_name: "Toon",
                    last_name: "De Superstudent",
                    last_login: "2023-05-04T12:00:00.000Z",
                    date_added: "2023-05-04T12:00:00.000Z",
                    phone: "9876543210",
                    address_id: 2,
                    address: {
                        id: 2,
                        street: "Sint-Pietersnieuwstraat",
                        number: 25,
                        city: "Ghent",
                        zip_code: 9000,
                        latitude: 51.04732,
                        longitude: 3.7282,
                    },
                    student: false,
                    super_student: true,
                    admin: false,
                    deleted: false,
                },
                round: {
                    id: 1,
                    deleted: false,
                    name: "Round 1",
                    description: "Description of round 1",
                    buildings: [
                        {
                            id: 1,
                            round_id: 1,
                            building_id: 1,
                            deleted: false,
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
                    ],
                },
            };

            await runner.patch({
                url: "/schedule/1",
                data: { user_id: 2 },
                expectedResponse: response,
            });
        });

        test("DELETE /schedule/:id", async () => {
            await runner.delete({
                url: "/schedule/1",
            });
        });

        test("Soft-delete a schedule", async () => {
            const response = await runner.delete({
                url: "/schedule/1",
                data: { hardDelete: false },
            });

            expect(response.body["deleted"]).toBeTruthy();
        });
    });

    describe("Unsuccessful requests", () => {
        describe("Must have correct authorisation", () => {
            test("Can't reach any path without authorisation", async () => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                await runner.get({
                    url: "/schedule",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.get({
                    url: "/schedule/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/schedule",
                    data: {
                        day: new Date().toISOString(),
                        user_id: 1,
                        round_id: 1,
                    },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/schedule/1",
                    data: { user_id: 1 },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/schedule/1",
                    statusCode: 403,
                });
            });
            test("Can't reach any path as Student except specific GET and PATCH", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.get({
                    url: "/schedule",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/schedule",
                    data: {
                        day: new Date().toISOString(),
                        user_id: 1,
                        round_id: 1,
                    },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/schedule/1",
                    statusCode: 403,
                });
            });
        });
        describe("Can't change id to a non-existent one", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Can't change user id to non-existent one", async () => {
                await runner.patch({
                    url: "/schedule/1",
                    data: { user_id: 6 },
                    expectedResponse: badRequestForeignKey,
                    statusCode: 400,
                });
            });
            test("Can't change round id to non-existent one", async () => {
                await runner.patch({
                    url: "/schedule/1",
                    data: { round_id: 6 },
                    expectedResponse: badRequestForeignKey,
                    statusCode: 400,
                });
            });
        });
        describe("Cannot reference a non-existent schedule", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Can't GET a non-existent schedule", async () => {
                await runner.get({
                    url: "/schedule/9",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });
            test("Can't PATCH a non-existent schedule", async () => {
                await runner.patch({
                    url: "/schedule/9",
                    data: { user_id: 1 },
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Can't DELETE a non-existent schedule", async () => {
                await runner.delete({
                    url: "/schedule/9",
                    statusCode: 404,
                });
            });
        });
        test("Cannot assign a wrong type to a field", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.patch({
                url: "/schedule/1",
                data: { user_id: "foo" },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });
        });
    });

    describe("Bugs", () => {
        describe("Issue 454: Student must be able to PATCH /schedule belonging to them", () => {
            test("Student is allowed to change the start and end date of their assigned schedule", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                const expected = {
                    id: 1,
                    day: "2023-05-04T12:00:00.000Z",
                    start: "2023-05-18T13:53:22.831Z",
                    end: "2023-05-18T13:58:04.457Z",
                    user_id: 1,
                    round_id: 1,
                    deleted: false,
                    user: {
                        id: 1,
                        email: "student@trottoir.be",
                        first_name: "Dirk",
                        last_name: "De Student",
                        last_login: "2023-05-04T12:00:00.000Z",
                        date_added: "2023-05-04T12:00:00.000Z",
                        phone: "0123456789",
                        address_id: 1,
                        address: {
                            id: 1,
                            street: "Wallaby Way",
                            number: 42,
                            city: "Sydney",
                            zip_code: 2000,
                            latitude: -33.865143,
                            longitude: 151.2099,
                        },
                        student: true,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                    round: {
                        id: 1,
                        name: "Round 1",
                        deleted: false,
                        description: "Description of round 1",
                        buildings: [
                            {
                                id: 1,
                                round_id: 1,
                                building_id: 1,
                                deleted: false,
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
                        ],
                    },
                };
                await runner.patch({
                    url: "/schedule/1",
                    data: {
                        start: "2023-05-18T13:53:22.831Z",
                        end: "2023-05-18T13:58:04.457Z",
                    },
                    expectedResponse: expected,
                });
            });
            test("Student cannot change any other fields than `start` and `end`", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.patch({
                    url: "/schedule/1",
                    data: {
                        day: "2023-05-18T13:58:04.457Z",
                    },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });

                await runner.patch({
                    url: "/schedule/1",
                    data: {
                        user_id: 2,
                    },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });

                await runner.patch({
                    url: "/schedule/1",
                    data: {
                        round_id: 5,
                    },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });

                await runner.patch({
                    url: "/schedule/1",
                    data: {
                        deleted: true,
                    },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("Student cannot change a schedule not assigned to them", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.patch({
                    url: "/schedule/2",
                    data: {
                        start: "2023-05-18T13:53:22.831Z",
                    },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
