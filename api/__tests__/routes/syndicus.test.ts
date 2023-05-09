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

describe("Syndicus tests", () => {
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
        test("GET /syndicus", async () => {
            const expected = [
                {
                    building: [
                        {
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
                        {
                            address: {
                                city: "Ghent",
                                id: 3,
                                latitude: 51.02776,
                                longitude: 3.71847,
                                number: 281,
                                street: "Krijgslaan",
                                zip_code: 9000,
                            },
                            deleted: true,
                            id: 3,
                            ivago_id: "ivago-3",
                            name: "Building 3",
                        },
                    ],
                    id: 1,
                    user: {
                        address: {
                            city: "Ghent",
                            id: 3,
                            latitude: 51.02776,
                            longitude: 3.71847,
                            number: 281,
                            street: "Krijgslaan",
                            zip_code: 9000,
                        },
                        address_id: 3,
                        admin: false,
                        date_added: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        email: "syndicus@trottoir.be",
                        first_name: "Simon",
                        id: 4,
                        last_login: "2023-05-04T12:00:00.000Z",
                        last_name: "De Syndicus",
                        phone: "7894561230",
                        student: false,
                        super_student: false,
                    },
                    user_id: 4,
                },
                {
                    building: [
                        {
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
                    ],
                    id: 2,
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
            ];

            await runner.get({
                url: "/syndicus",
                expectedData: expected,
            });
        });

        test("GET /syndicus/:id", async () => {
            const expected = [
                {
                    id: 1,
                    user_id: 4,
                    user: {
                        id: 4,
                        email: "syndicus@trottoir.be",
                        first_name: "Simon",
                        last_name: "De Syndicus",
                        last_login: "2023-05-04T12:00:00.000Z",
                        date_added: "2023-05-04T12:00:00.000Z",
                        phone: "7894561230",
                        address_id: 3,
                        address: {
                            id: 3,
                            street: "Krijgslaan",
                            number: 281,
                            city: "Ghent",
                            zip_code: 9000,
                            latitude: 51.02776,
                            longitude: 3.71847,
                        },
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                    building: [
                        {
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
                        {
                            id: 3,
                            name: "Building 3",
                            ivago_id: "ivago-3",
                            description: "Description of building 3",
                            deleted: true,
                            address: {
                                id: 3,
                                street: "Krijgslaan",
                                number: 281,
                                city: "Ghent",
                                zip_code: 9000,
                                latitude: 51.02776,
                                longitude: 3.71847,
                            },
                        },
                    ],
                },
            ];
            await runner.get({
                url: "/syndicus/1",
                expectedData: expected,
            });
        });

        test("POST /syndicus", async () => {
            const syndicus = {
                user_id: 3,
            };

            const expected = {
                user_id: 3,
                user: {
                    id: 3,
                    email: "administrator@trottoir.be",
                    first_name: "Mario",
                    last_name: "De Administrator",
                    last_login: "2023-05-04T12:00:00.000Z",
                    date_added: "2023-05-04T12:00:00.000Z",
                    phone: "6549873210",
                    address_id: 3,
                    address: {
                        id: 3,
                        street: "Krijgslaan",
                        number: 281,
                        city: "Ghent",
                        zip_code: 9000,
                        latitude: 51.02776,
                        longitude: 3.71847,
                    },
                    student: false,
                    super_student: false,
                    admin: true,
                    deleted: false,
                },
                building: [],
            };

            await runner.post({
                url: "/syndicus",
                data: syndicus,
                expectedResponse: expected,
            });
        });

        test("PATCH /syndicus/:id", async () => {
            const updated = { user_id: 2 };
            const expected = {
                id: 1,
                user_id: 2,
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
                building: [
                    {
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
                    {
                        id: 3,
                        name: "Building 3",
                        ivago_id: "ivago-3",
                        description: "Description of building 3",
                        deleted: true,
                        address: {
                            id: 3,
                            street: "Krijgslaan",
                            number: 281,
                            city: "Ghent",
                            zip_code: 9000,
                            latitude: 51.02776,
                            longitude: 3.71847,
                        },
                    },
                ],
            };
            await runner.patch({
                url: "/syndicus/1",
                data: updated,
                expectedResponse: expected,
            });
        });

        test("DELETE /syndicus/:id", async () => {
            await runner.delete({
                url: "/building/1",
                data: { hardDelete: true },
            });
            await runner.delete({
                url: "/building/3",
                data: { hardDelete: true },
            });
            await runner.delete({
                url: "/syndicus/1",
            });
        });
    });

    describe("Unsuccessful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        test("Deleting syndicus who's linked to a building", async () => {
            await runner.delete({
                url: "/syndicus/1",
                statusCode: 400,
            });
        });
        test("Requests using non-existent syndicus", async () => {
            const url = "/syndicus/9";
            await runner.get({
                url: url,
                expectedData: [notFoundResponse],
                statusCode: 404,
            });

            await runner.patch({
                url: url,
                data: { user_id: 2 },
                expectedResponse: notFoundResponse,
                statusCode: 404,
            });

            await runner.delete({
                url: url,
                statusCode: 404,
            });
        });
        test("Requests using wrong type", async () => {
            const url = "/syndicus/foo";
            await runner.get({
                url: url,
                expectedData: [badRequestResponse],
                statusCode: 400,
            });

            await runner.patch({
                url: url,
                data: { user_id: 2 },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });

            await runner.delete({
                url: url,
                statusCode: 400,
            });
        });
        test("Assigning wrong type to user_id", async () => {
            await runner.patch({
                url: "/syndicus/1",
                data: { user_id: "25" },
                expectedResponse: badRequestForeignKey,
                statusCode: 400,
            });
        });
        describe("Must be correctly authenticated to use any path", () => {
            test("Cannot make any requests without authorisation", async () => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                await runner.get({
                    url: "/syndicus/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.get({
                    url: "/syndicus",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/syndicus",
                    data: { user_id: 5 },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/syndicus/1",
                    data: { user_id: 5 },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/syndicus/1",
                    statusCode: 403,
                });
            });
            test("Cannot make any requests as student", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.get({
                    url: "/syndicus/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.get({
                    url: "/syndicus",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/syndicus",
                    data: { user_id: 5 },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/syndicus/1",
                    data: { user_id: 5 },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/syndicus/1",
                    statusCode: 403,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
