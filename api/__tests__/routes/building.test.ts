import { afterAll, beforeAll, describe, test } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase, restoreTables } from "../mock/database";
import {
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
} from "../utilities/constants";
import { image, manual } from "../mock/file";

describe("Building tests", () => {
    let runner: Testrunner;

    beforeAll(() => {
        const server = request(app);
        runner = new Testrunner(server);

        return resetDatabase();
    });

    afterEach(async () => {
        await restoreTables();
    });

    describe("Succesful requests", () => {
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        test("GET /building", async () => {
            const buildings = [
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
                    images: [
                        {
                            building_id: 1,
                            id: 1,
                            image: image,
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-1",
                    manual: manual,
                    name: "Building 1",
                    description: "Description of building 1",
                    expected_time: 100,
                    syndicus: {
                        id: 1,
                        user: {
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
                    deleted: false,
                    id: 2,
                    images: [
                        {
                            building_id: 2,
                            id: 2,
                            image: image,
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-2",
                    description: "Description of building 2",
                    manual: manual,
                    name: "Building 2",
                    expected_time: 200,
                    syndicus: {
                        id: 2,
                        user: {
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
                },
            ];

            await runner.get({
                url: "/building",
                expectedData: buildings,
            });
        });

        describe("GET /building/:id with different roles", () => {
            const building = {
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
                images: [
                    {
                        building_id: 1,
                        id: 1,
                        image: image,
                        image_id: image.id,
                    },
                ],
                ivago_id: "ivago-1",
                description: "Description of building 1",
                manual: manual,
                name: "Building 1",
                expected_time: 100,
                syndicus: {
                    id: 1,
                    user: {
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
            };

            test("GET /building/:id as Student", async () => {
                runner.authLevel(AuthenticationLevel.STUDENT);

                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Superstudent", async () => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Admin", async () => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Syndicus", async () => {
                runner.authLevel(AuthenticationLevel.SYNDICUS);
                await runner.get({
                    url: "/building/1",
                    expectedData: [building],
                });
            });

            test("GET /building/:id as Resident", async () => {
                runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                const buildingResident = {
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
                    garbage: [],
                    id: 1,
                    images: [
                        {
                            building_id: 1,
                            id: 1,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-1",
                    manual: manual,
                    name: "Building 1",
                    progress: [],
                    syndicus: {
                        id: 1,
                        user: {
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
                };
                await runner.get({
                    url: "/building/aaaa",
                    expectedData: [buildingResident],
                });
            });
        });

        test("PATCH /building/:id", async () => {
            const building = (await runner.getRaw("/building/1")).body;
            building["name"] = "Building 1 New";
            // delete fields that are not part of the request, but set fields accordingly for the request
            building["address_id"] = building["address"]["id"];
            delete building["address"];

            building["syndicus_id"] = building["syndicus"]["id"];
            delete building["syndicus"];

            building["manual_id"] = building["manual"]["id"];
            delete building["manual"];
            delete building["images"];
            delete building["id"];

            const expected = {
                id: 1,
                name: "Building 1 New",
                expected_time: 100,
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
                syndicus: {
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
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                },
                manual: manual,
                images: [
                    {
                        id: 1,
                        building_id: 1,
                        image_id: image.id,
                        image: image,
                    },
                ],
            };

            await runner.patch({
                url: "/building/1",
                data: building,
                expectedResponse: expected,
            });
        });

        test("PATCH /building/:id (change hash)", async () => {
            const changeHash = {
                hash: true,
            };

            const expected = {
                id: 1,
                name: "Building 1",
                ivago_id: "ivago-1",
                deleted: false,
                description: "Description of building 1",
                expected_time: 100,
                address: {
                    id: 1,
                    street: "Wallaby Way",
                    number: 42,
                    city: "Sydney",
                    zip_code: 2000,
                    latitude: -33.865143,
                    longitude: 151.2099,
                },
                syndicus: {
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
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                },
                manual: manual,
                images: [
                    {
                        id: 1,
                        building_id: 1,
                        image_id: image.id,
                        image: {
                            createdAt: "1970-01-01T00:00:00.000Z",
                            id: 2,
                            mime: "application/jpeg",
                            original_name: "camera.jpg",
                            path: "camera.jpg",
                            size_in_bytes: 1024,
                            updatedAt: "1970-01-01T00:00:00.000Z",
                            user_id: 1,
                        },
                    },
                ],
            };

            await runner.patch({
                url: "/building/1",
                data: changeHash,
                expectedResponse: expected,
            });
        });

        test("POST /building", async () => {
            const building = {
                name: "new building",
                ivago_id: "ivago-new",
                description: "Description of new building",
                expected_time: 100,
                address_id: 3,
                manual_id: manual.id,
                syndicus_id: 1,
            };

            const expectedBuilding = {
                name: "new building",
                ivago_id: "ivago-new",
                description: "Description of new building",
                expected_time: 100,
                deleted: false,
                address: {
                    id: 3,
                    street: "Krijgslaan",
                    number: 281,
                    city: "Ghent",
                    zip_code: 9000,
                    latitude: 51.02776,
                    longitude: 3.71847,
                },
                syndicus: {
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
                        student: false,
                        super_student: false,
                        admin: false,
                        deleted: false,
                    },
                },
                manual: manual,
                images: [],
            };

            await runner.post({
                url: "/building",
                data: building,
                expectedResponse: expectedBuilding,
                statusCode: 201,
            });
        });

        test("DELETE /building/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const hardBuilding = {
                hardDelete: true,
            };
            await runner.delete({
                url: "/building/1",
                data: hardBuilding,
            });

            // verify that the building is truly deleted

            const expected = [
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
                    description: "Description of building 2",
                    expected_time: 200,
                    id: 2,
                    images: [
                        {
                            building_id: 2,
                            id: 2,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-2",
                    manual: manual,
                    name: "Building 2",
                    syndicus: {
                        id: 2,
                        user: {
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
                    description: "Description of building 3",
                    expected_time: 150,
                    id: 3,
                    images: [
                        {
                            building_id: 3,
                            id: 3,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-3",
                    manual: manual,
                    name: "Building 3",
                    syndicus: {
                        id: 1,
                        user: {
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
                },
            ];
            await runner.get({
                url: "/building?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /building/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({
                url: "/building/1",
            });

            // verify that the building is soft deleted

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
                    deleted: true,
                    description: "Description of building 1",
                    expected_time: 100,
                    id: 1,
                    images: [
                        {
                            building_id: 1,
                            id: 1,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-1",
                    manual: manual,
                    name: "Building 1",
                    syndicus: {
                        id: 1,
                        user: {
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
                    deleted: false,
                    description: "Description of building 2",
                    expected_time: 200,
                    id: 2,
                    images: [
                        {
                            building_id: 2,
                            id: 2,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-2",
                    manual: manual,
                    name: "Building 2",
                    syndicus: {
                        id: 2,
                        user: {
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
                    description: "Description of building 3",
                    expected_time: 150,
                    id: 3,
                    images: [
                        {
                            building_id: 3,
                            id: 3,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-3",
                    manual: manual,
                    name: "Building 3",
                    syndicus: {
                        id: 1,
                        user: {
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
                },
            ];
            await runner.get({
                url: "/building?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /building/:id (super-student)", async () => {
            await runner.delete({
                url: "/building/1",
            });

            // verify that the building is soft deleted

            const expected = [
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
                    description: "Description of building 2",
                    expected_time: 200,
                    id: 2,
                    images: [
                        {
                            building_id: 2,
                            id: 2,
                            image: {
                                createdAt: "1970-01-01T00:00:00.000Z",
                                id: 2,
                                mime: "application/jpeg",
                                original_name: "camera.jpg",
                                path: "camera.jpg",
                                size_in_bytes: 1024,
                                updatedAt: "1970-01-01T00:00:00.000Z",
                                user_id: 1,
                            },
                            image_id: image.id,
                        },
                    ],
                    ivago_id: "ivago-2",
                    manual: manual,
                    name: "Building 2",
                    syndicus: {
                        id: 2,
                        user: {
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
                },
            ];
            await runner.get({
                url: "/building",
                expectedData: expected,
            });
        });

        test("POST /building/:id/image", async () => {
            const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));
            const image = {
                image: 2,
            };

            const expectedBuilding = {
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
                expected_time: 100,
                images: [
                    {
                        building_id: 1,
                        id: 1,
                        image: {
                            createdAt: "1970-01-01T00:00:00.000Z",
                            id: 2,
                            mime: "application/jpeg",
                            original_name: "camera.jpg",
                            path: "camera.jpg",
                            size_in_bytes: 1024,
                            updatedAt: "1970-01-01T00:00:00.000Z",
                            user_id: 1,
                        },
                        image_id: 2,
                    },
                    {
                        building_id: 1,
                        id: 4,
                        image: {
                            createdAt: "1970-01-01T00:00:00.000Z",
                            id: 2,
                            mime: "application/jpeg",
                            original_name: "camera.jpg",
                            path: "camera.jpg",
                            size_in_bytes: 1024,
                            updatedAt: "1970-01-01T00:00:00.000Z",
                            user_id: 1,
                        },
                        image_id: 2,
                    },
                ],
                ivago_id: "ivago-1",
                manual: manual,
                name: "Building 1",
                syndicus: {
                    id: 1,
                    user: {
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
            };

            await runner.post({
                url: "/building/1/image",
                data: image,
                expectedResponse: expectedBuilding,
                statusCode: 201,
            });
        });

        test("DELETE /building/:id/image/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const hardDelete = {
                hardDelete: true,
            };
            await runner.delete({
                url: "/building/1/image/2",
                data: hardDelete,
            });

            // verify that the building image is truly soft deleted

            const expected = {
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
                expected_time: 100,
                id: 1,
                images: [],
                ivago_id: "ivago-1",
                manual: manual,
                name: "Building 1",
                syndicus: {
                    id: 1,
                    user: {
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
            };

            await runner.get({
                url: "/building/1?deleted=true",
                expectedData: [expected],
            });
        });
    });
    describe("Unsuccessful requests", () => {
        describe("Must have correct authorisation", () => {
            const newBuilding = {
                name: "new building",
                ivago_id: "ivago-new",
                description: "Description of new building",
                expected_time: 100,
                address_id: 3,
                manual_id: manual.id,
                syndicus_id: 1,
            };
            describe("Can't use any path unauthorized", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });
                test("Can't GET /building", async () => {
                    await runner.get({
                        url: "/building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't GET /building/:id", async () => {
                    await runner.get({
                        url: "/building/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't POST /building", async () => {
                    await runner.post({
                        url: "/building",
                        data: newBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't PATCH /building/:id", async () => {
                    await runner.patch({
                        url: "/building/1",
                        data: { name: "Adapted Building" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't DELETE /building/:id", async () => {
                    await runner.delete({
                        url: "/building/1",
                        statusCode: 403,
                    });
                });

                test("GET /building/:id (Resident can`t see soft deleted building)", async () => {
                    runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
                    await runner.delete({
                        url: "/building/1",
                    });

                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                    await runner.get({
                        url: "/building/aaaa",
                        expectedData: [{ message: "Not Found" }],
                        statusCode: 404,
                    });
                });
            });
            describe("Can't use any path as Student except concrete GET", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });
                test("Can't GET /building", async () => {
                    await runner.get({
                        url: "/building",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });
                test("Can't POST /building", async () => {
                    await runner.post({
                        url: "/building",
                        data: newBuilding,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't PATCH /building/:id", async () => {
                    await runner.patch({
                        url: "/building/1",
                        data: { name: "Adapted Building" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });
                test("Can't DELETE /building/:id", async () => {
                    await runner.delete({
                        url: "/building/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("Cannot assign non-existent IDs", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Cannot assign non-existent syndicus ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: {
                        syndicus_id: 0,
                    },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("Cannot assign non-existent address ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { address_id: 0 },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("Cannot assign non-existent manual ID", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { manual_id: 0 },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });
        describe("Cannot query for non-existent buildings ", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });
            test("Cannot GET /building/20", async () => {
                await runner.get({
                    url: "/building/20",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Cannot PATCH /building/20", async () => {
                await runner.patch({
                    url: "/building/20",
                    data: { name: "New Building Name" },
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });

            test("Cannot DELETE /building/20", async () => {
                await runner.delete({
                    url: "/building/20",
                    statusCode: 404,
                });
            });

            test("Cannot DELETE /building/:id/image/:id", async () => {
                await runner.delete({
                    url: "/building/1/image/20",
                    statusCode: 404,
                });
            });
        });
        describe("Cannot change buildings using wrong types", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            });

            test("PATCH using wrong key", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { bad_key: "foo" },
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
            test("PATCH with correct key but wrong value type", async () => {
                await runner.patch({
                    url: "/building/1",
                    data: { name: 5 }, // int instead of string
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("POST building with hash", async () => {
                const building = {
                    name: "new building",
                    ivago_id: "ivago-new",
                    address_id: 3,
                    manual_id: 3,
                    syndicus_id: 1,
                    hash: "abcd",
                };

                await runner.post({
                    url: "/building",
                    data: building,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});
