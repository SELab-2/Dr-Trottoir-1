import { describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase, restoreTables } from "../mock/database";
import {
    badRequestResponse,
    conflictResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";

describe("User tests", () => {
    let runner: Testrunner;
    beforeAll(() => {
        const server = request(app);
        runner = new Testrunner(server);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    /**
     * Positive tests against the API.
     */
    describe("Successful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        test("GET /user", async () => {
            const expected = [
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
                    regions: [
                        {
                            id: 1,
                            region: { deleted: false, id: 1, name: "Region 1" },
                            region_id: 1,
                            user_id: 1,
                        },
                    ],
                    student: true,
                    super_student: false,
                },
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
                    regions: [
                        {
                            id: 2,
                            region: { deleted: false, id: 2, name: "Region 2" },
                            region_id: 2,
                            user_id: 2,
                        },
                    ],
                    student: false,
                    super_student: true,
                },
            ];
            await runner.get({
                url: "/user",
                expectedData: expected,
            });
        });
        test("GET /user/:id", async () => {
            const expected = [
                {
                    id: 1,
                    email: "student@trottoir.be",
                    first_name: "Dirk",
                    last_name: "De Student",
                    last_login: "2023-05-04T12:00:00.000Z",
                    date_added: "2023-05-04T12:00:00.000Z",
                    phone: "0123456789",
                    address_id: 1,
                    student: true,
                    super_student: false,
                    admin: false,
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
                    regions: [
                        {
                            id: 1,
                            user_id: 1,
                            region_id: 1,
                            region: { id: 1, name: "Region 1", deleted: false },
                        },
                    ],
                },
            ];
            await runner.get({
                url: "/user/1",
                expectedData: expected,
            });
        });
        test("POST /user", async () => {
            const user = {
                email: "foo@bar.com",
                first_name: "Foo",
                last_name: "Bar",
                date_added: "2020-01-01T00:00:00.000Z",
                last_login: "2020-01-01T00:00:00.000Z",
                phone: "23457890",
                address_id: 4,
                student: false,
                super_student: true,
                admin: false,
                password: "FoooB4r.",
            };

            const expected = {
                id: 6,
                email: "foo@bar.com",
                first_name: "Foo",
                last_name: "Bar",
                last_login: "2020-01-01T00:00:00.000Z",
                date_added: "2020-01-01T00:00:00.000Z",
                phone: "23457890",
                address_id: 4,
                student: false,
                super_student: true,
                admin: false,
                deleted: false,
                address: {
                    id: 4,
                    street: "Krijgslaan",
                    number: 282,
                    city: "Ghent",
                    zip_code: 9000,
                    latitude: 51.02776,
                    longitude: 3.71847,
                },
                regions: [],
            };

            await runner.post({
                url: "/user",
                data: user,
                expectedResponse: expected,
            });
        });
        test("PATCH /user/:id", async () => {
            const user = (await runner.getRaw("/user/1")).body;
            user.first_name = "Baz";

            await runner.patch({
                url: "/user/1",
                data: { first_name: "Baz" },
                expectedResponse: user,
            });
        });

        test("DELETE /user/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const hardUser = {
                hardDelete: true,
            };
            await runner.delete({
                url: "/user/5",
                data: hardUser,
            });

            // verify that the user is truly deleted

            const expected = [
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
                    regions: [
                        {
                            id: 1,
                            region: { deleted: false, id: 1, name: "Region 1" },
                            region_id: 1,
                            user_id: 1,
                        },
                    ],
                    student: true,
                    super_student: false,
                },
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
                    regions: [
                        {
                            id: 2,
                            region: { deleted: false, id: 2, name: "Region 2" },
                            region_id: 2,
                            user_id: 2,
                        },
                    ],
                    student: false,
                    super_student: true,
                },
            ];

            await runner.get({
                url: "/user?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /user/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({
                url: "/user/1",
            });

            // verify that the user is truly soft deleted

            const expected = [
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
                    address_id: 1,
                    admin: false,
                    date_added: "2023-05-04T12:00:00.000Z",
                    deleted: true,
                    email: "student@trottoir.be",
                    first_name: "Dirk",
                    id: 1,
                    last_login: "2023-05-04T12:00:00.000Z",
                    last_name: "De Student",
                    phone: "0123456789",
                    regions: [
                        {
                            id: 1,
                            region: { deleted: false, id: 1, name: "Region 1" },
                            region_id: 1,
                            user_id: 1,
                        },
                    ],
                    student: true,
                    super_student: false,
                },
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
                    regions: [
                        {
                            id: 2,
                            region: { deleted: false, id: 2, name: "Region 2" },
                            region_id: 2,
                            user_id: 2,
                        },
                    ],
                    student: false,
                    super_student: true,
                },
            ];

            await runner.get({
                url: "/user?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /user/:id (super-student", async () => {
            await runner.delete({
                url: "/user/5",
            });

            // verify that the user is truly soft deleted

            const expected = [
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
                    regions: [
                        {
                            id: 1,
                            region: { deleted: false, id: 1, name: "Region 1" },
                            region_id: 1,
                            user_id: 1,
                        },
                    ],
                    student: true,
                    super_student: false,
                },
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
                    regions: [
                        {
                            id: 2,
                            region: { deleted: false, id: 2, name: "Region 2" },
                            region_id: 2,
                            user_id: 2,
                        },
                    ],
                    student: false,
                    super_student: true,
                },
            ];

            await runner.get({
                url: "/user",
                expectedData: expected,
            });
        });

        test("Student can look themselves up", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            const expected = [
                {
                    id: 1,
                    email: "student@trottoir.be",
                    first_name: "Dirk",
                    last_name: "De Student",
                    last_login: "2023-05-04T12:00:00.000Z",
                    date_added: "2023-05-04T12:00:00.000Z",
                    phone: "0123456789",
                    address_id: 1,
                    student: true,
                    super_student: false,
                    admin: false,
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
                    regions: [
                        {
                            id: 1,
                            user_id: 1,
                            region_id: 1,
                            region: { id: 1, name: "Region 1", deleted: false },
                        },
                    ],
                },
            ];

            await runner.get({
                url: "/user/1",
                expectedData: expected,
            });
        });

        test("PATCH /user/:id (change password)", async () => {
            const user = (await runner.getRaw("/user/1")).body;

            const changePassword = {
                password: "Pa55word#",
            };

            await runner.patch({
                url: "/user/1",
                data: changePassword,
                expectedResponse: user,
            });
        });
    });
    /**
     * Negative tests against the API.
     */
    describe("Unsuccessful requests", () => {
        const user: any = {
            email: "foo@bar.com",
            first_name: "Foo",
            last_name: "Bar",
            date_added: "2020-01-01T00:00:00.000Z",
            last_login: "2020-01-01T00:00:00.000Z",
            phone: "23457890",
            address_id: 4,
            student: false,
            super_student: true,
            admin: false,
            password: "FoooB4r.",
        };
        describe("Must be correctly authorized", () => {
            test("Can't use any path without authorization", async () => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                await runner.get({
                    url: "/user",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.get({
                    url: "/user/1",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/user",
                    data: user,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/user/1",
                    data: { first_name: "Foo" },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/user/1",
                    statusCode: 403,
                });
            });
            test("Student cannot use any path except for getting self", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);
                await runner.get({
                    url: "/user",
                    expectedData: [forbiddenResponse],
                    statusCode: 403,
                });

                await runner.post({
                    url: "/user",
                    data: user,
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.patch({
                    url: "/user/2",
                    data: { first_name: "Foo" },
                    expectedResponse: forbiddenResponse,
                    statusCode: 403,
                });

                await runner.delete({
                    url: "/user/2",
                    statusCode: 403,
                });
            });
        });
        test("Cannot query for non-existent user", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            const url = "/user/6";
            await runner.get({
                url: url,
                expectedData: [notFoundResponse],
                statusCode: 404,
            });

            await runner.patch({
                url: url,
                data: { first_name: "Foo" },
                expectedResponse: notFoundResponse,
                statusCode: 404,
            });

            await runner.delete({
                url: url,
                statusCode: 404,
            });
        });
        test("Cannot query with wrong parameter type", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            const url = "/user/foo";
            await runner.get({
                url: url,
                expectedData: [badRequestResponse],
                statusCode: 400,
            });

            await runner.patch({
                url: url,
                data: { first_name: "Foo" },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });

            await runner.delete({
                url: url,
                statusCode: 400,
            });
        });
        test("Cannot add user with duplicate email", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            const newUser = {
                email: "student@trottoir.be",
                first_name: "foo",
                last_name: "bar",
                date_added: "2020-01-01T00:00:00.000Z",
                last_login: "2020-01-01T00:00:00.000Z",
                phone: "516135485312",
                address_id: 4,
                student: false,
                super_student: false,
                admin: true,
                password: "FoooB4r.",
            };

            await runner.post({
                url: "/user",
                data: newUser,
                expectedResponse: conflictResponse,
                statusCode: 409,
            });
        });
        describe("Cannot send salt and hash in the request", () => {
            test("Can't create a new user with predefined hash and salt", async () => {
                user.hash = "hash";
                user.salt = "salt";
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
                await runner.post({
                    url: "/user",
                    data: user,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("Can't PATCH user to a certain hash or salt", async () => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
                await runner.patch({
                    url: "/user/1",
                    data: { hash: "some new hash" },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });

                await runner.patch({
                    url: "/user/1",
                    data: { salt: "new salt" },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });

        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent user", async () => {
                await runner.get({
                    url: "/user/100",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent user", async () => {
                const newUser = {
                    first_name: "Ik",
                };
                await runner.patch({
                    url: "/user/1000",
                    data: newUser,
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent user", async () => {
                await runner.delete({ url: "/user/100", statusCode: 404 });
            });
        });
        describe("The type of user id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/user/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const newUser = {
                    name: "Ik",
                };

                await runner.patch({
                    url: "/user/wrongtype",
                    data: newUser,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/user/wrongtype",
                    statusCode: 400,
                });
            });
        });
    });

    describe("Password validation tests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
        });

        const expected = {
            id: 1,
            email: "student@trottoir.be",
            first_name: "Dirk",
            last_name: "De Student",
            last_login: "2023-05-04T12:00:00.000Z",
            date_added: "2023-05-04T12:00:00.000Z",
            phone: "0123456789",
            address_id: 1,
            student: true,
            super_student: false,
            admin: false,
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
            regions: [
                {
                    id: 1,
                    user_id: 1,
                    region_id: 1,
                    region: { id: 1, name: "Region 1", deleted: false },
                },
            ],
        };

        test("Password must have at least 8 characters", async () => {
            // password is too short
            await runner.patch({
                url: "/user/1",
                data: { password: "Sh0rPs." },
                statusCode: 400,
                expectedResponse: badRequestResponse,
            });

            // Password is long enough
            await runner.patch({
                url: "/user/1",
                data: { password: "L0ngPassword." },
                expectedResponse: expected,
            });
        });

        test("Password must have at least one numeric character", async () => {
            await runner.patch({
                url: "/user/1",
                data: { password: "NoNumericPresent." },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });

            await runner.patch({
                url: "/user/1",
                data: { password: "Numer1cPr3sent." },
                expectedResponse: expected,
            });
        });

        test("Password must have at least one uppercase character", async () => {
            await runner.patch({
                url: "/user/1",
                data: { password: "alll0wercase." },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });

            await runner.patch({
                url: "/user/1",
                data: { password: "UpperC4sePresent." },
                expectedResponse: expected,
            });
        });

        test("Password must have at least one special character", async () => {
            await runner.patch({
                url: "/user/1",
                data: { password: "NoSp3cialCharsHere" },
                expectedResponse: badRequestResponse,
                statusCode: 400,
            });

            await runner.patch({
                url: "/user/1",
                data: { password: "Sp3cial.Chars.Present!" },
                expectedResponse: expected,
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
