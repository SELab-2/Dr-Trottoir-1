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

describe("Progress tests", () => {
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
        beforeEach(() => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
        });

        test("POST /progress", async () => {
            const timestamp: Date = new Date(Date.UTC(2023, 7, 4, 16, 0, 0));

            const newProgress = {
                report: "Report 2",
                arrival: timestamp,
                departure: timestamp,

                building_id: 1,
                schedule_id: 1,
            };

            const expected = {
                arrival: "2023-08-04T16:00:00.000Z",
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
                departure: "2023-08-04T16:00:00.000Z",
                images: [],
                report: "Report 2",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    end: "2023-05-04T12:20:00.000Z",
                    deleted: false,
                    id: 1,
                    round: {
                        id: 1,
                        deleted: false,
                        name: "Round 1",
                        description: "Description of round 1",
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };

            await runner.post({
                url: "/progress",
                data: newProgress,
                expectedResponse: expected,
            });
        });

        test("GET /progress", async () => {
            const expected = [
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 1,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 1",
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
                            progress_id: 1,
                            type: "ARRIVAL",
                        },
                    ],
                    report: "Report 1",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 1,
                        round: {
                            description: "Description of round 1",
                            id: 1,
                            name: "Round 1",
                            deleted: false,
                        },
                        round_id: 1,
                        start: "2023-05-04T12:10:00.000Z",
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
                    schedule_id: 1,
                },
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 2,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 2",
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
                            image_id: 2,
                            progress_id: 2,
                            type: "GARBAGE",
                        },
                    ],
                    report: "Report 2",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 2,
                        round: {
                            description: "Description of round 2",
                            id: 2,
                            name: "Round 2",
                            deleted: false,
                        },
                        round_id: 2,
                        start: "2023-05-04T12:10:00.000Z",
                        user: {
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
                    schedule_id: 2,
                },
            ];

            await runner.get({ url: "/progress", expectedData: expected });
        });

        test("GET /progress/:id", async () => {
            const expected = [
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 1,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 1",
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
                            progress_id: 1,
                            type: "ARRIVAL",
                        },
                    ],
                    report: "Report 1",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        start: "2023-05-04T12:10:00.000Z",
                        id: 1,
                        round: {
                            id: 1,
                            description: "Description of round 1",
                            name: "Round 1",
                            deleted: false,
                        },
                        round_id: 1,
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
                    schedule_id: 1,
                },
            ];

            await runner.get({ url: "/progress/1", expectedData: expected });
        });

        test("PATCH /progress/:id", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            const newProgress = {
                report: "Report 1.1",
            };

            const expected = {
                arrival: "2023-05-04T12:00:00.000Z",
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
                departure: "2023-05-04T12:00:00.000Z",
                id: 1,
                images: [
                    {
                        deleted: false,
                        description: "Description of progress image 1",
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
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                ],
                report: "Report 1.1",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    id: 1,
                    start: "2023-05-04T12:10:00.000Z",
                    end: "2023-05-04T12:20:00.000Z",
                    round: {
                        id: 1,
                        description: "Description of round 1",
                        name: "Round 1",
                        deleted: false,
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };

            await runner.patch({
                url: "/progress/1",
                data: newProgress,
                expectedResponse: expected,
            });
        });

        test("SOFT DELETE /progress/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({ url: "/progress/1" });

            // verify that the progress is soft deleted
            const expected = [
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 1,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 1",
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
                            progress_id: 1,
                            type: "ARRIVAL",
                        },
                    ],
                    report: "Report 1",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 1,
                        round: {
                            description: "Description of round 1",
                            id: 1,
                            name: "Round 1",
                            deleted: false,
                        },
                        round_id: 1,
                        start: "2023-05-04T12:10:00.000Z",
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
                    schedule_id: 1,
                },
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 2,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 2",
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
                            image_id: 2,
                            progress_id: 2,
                            type: "GARBAGE",
                        },
                    ],
                    report: "Report 2",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 2,
                        round: {
                            description: "Description of round 2",
                            id: 2,
                            name: "Round 2",
                            deleted: false,
                        },
                        round_id: 2,
                        start: "2023-05-04T12:10:00.000Z",
                        user: {
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
                    schedule_id: 2,
                },
            ];
            await runner.get({
                url: "/progress?deleted=true",
                expectedData: expected,
            });
        });

        test("SOFT DELETE /progress/:id (super-student)", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.delete({ url: "/progress/1" });

            // verify that the progress is soft deleted
            const expected = [
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 2,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 2",
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
                            image_id: 2,
                            progress_id: 2,
                            type: "GARBAGE",
                        },
                    ],
                    report: "Report 2",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 2,
                        round: {
                            description: "Description of round 2",
                            id: 2,
                            name: "Round 2",
                            deleted: false,
                        },
                        round_id: 2,
                        start: "2023-05-04T12:10:00.000Z",
                        user: {
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
                    schedule_id: 2,
                },
            ];
            await runner.get({
                url: "/progress",
                expectedData: expected,
            });
        });

        test("DELETE /progress/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const hardDelete = { hardDelete: true };
            await runner.delete({ url: "/progress/1", data: hardDelete });

            // verify that the progress is soft deleted
            const expected = [
                {
                    arrival: "2023-05-04T12:00:00.000Z",
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
                    departure: "2023-05-04T12:00:00.000Z",
                    id: 2,
                    images: [
                        {
                            deleted: false,
                            description: "Description of progress image 2",
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
                            image_id: 2,
                            progress_id: 2,
                            type: "GARBAGE",
                        },
                    ],
                    report: "Report 2",
                    schedule: {
                        day: "2023-05-04T12:00:00.000Z",
                        deleted: false,
                        end: "2023-05-04T12:20:00.000Z",
                        id: 2,
                        round: {
                            description: "Description of round 2",
                            id: 2,
                            name: "Round 2",
                            deleted: false,
                        },
                        round_id: 2,
                        start: "2023-05-04T12:10:00.000Z",
                        user: {
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
                    schedule_id: 2,
                },
            ];
            await runner.get({
                url: "/progress?deleted=true",
                expectedData: expected,
            });
        });
        test("POST /progress/:id/image", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            const newImage = {
                image_id: 2,
                type: "ARRIVAL",
                description: "arrival image",
            };
            const expected = {
                arrival: "2023-05-04T12:00:00.000Z",
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
                departure: "2023-05-04T12:00:00.000Z",
                images: [
                    {
                        deleted: false,
                        description: "Description of progress image 1",
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
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                    {
                        deleted: false,
                        description: "arrival image",
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
                        image_id: 2,
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                ],
                report: "Report 1",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    end: "2023-05-04T12:20:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    id: 1,
                    round: {
                        id: 1,
                        description: "Description of round 1",
                        name: "Round 1",
                        deleted: false,
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };
            await runner.post({
                url: "/progress/1/image",
                data: newImage,
                expectedResponse: expected,
            });
        });

        test("PATCH /progress/:id/image/:id", async () => {
            runner.authLevel(AuthenticationLevel.STUDENT);
            const newImage = {
                description: "REST",
            };
            const expected = {
                arrival: "2023-05-04T12:00:00.000Z",
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
                id: 1,
                deleted: false,
                departure: "2023-05-04T12:00:00.000Z",
                images: [
                    {
                        deleted: false,
                        description: "REST",
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
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                ],
                report: "Report 1",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    end: "2023-05-04T12:20:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    id: 1,
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                        deleted: false,
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };

            await runner.patch({
                url: "/progress/1/image/2",
                data: newImage,
                expectedResponse: expected,
            });
        });

        test("DELETE /progress/:id/image/:id", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            const deleted = {
                hardDelete: true,
            };
            await runner.delete({ url: "/progress/1/image/2", data: deleted });

            // verify that the progress image is truly deleted

            const expected = {
                arrival: "2023-05-04T12:00:00.000Z",
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
                id: 1,
                deleted: false,
                departure: "2023-05-04T12:00:00.000Z",
                images: [],
                report: "Report 1",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    end: "2023-05-04T12:20:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    id: 1,
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                        deleted: false,
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };

            await runner.get({
                url: "/progress/1?deleted=true",
                expectedData: [expected],
            });
        });

        test("SOFT DELETE /progress/:id/image/:id (admin)", async () => {
            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.delete({
                url: "/progress/1/image/2",
            });

            // verify that the progress image is deleted

            const expected = {
                arrival: "2023-05-04T12:00:00.000Z",
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
                id: 1,
                deleted: false,
                departure: "2023-05-04T12:00:00.000Z",
                images: [
                    {
                        deleted: true,
                        description: "Description of progress image 1",
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
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                ],
                report: "Report 1",
                schedule: {
                    day: "2023-05-04T12:00:00.000Z",
                    deleted: false,
                    id: 1,
                    end: "2023-05-04T12:20:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                        deleted: false,
                    },
                    round_id: 1,
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
                schedule_id: 1,
            };

            await runner.get({
                url: "/progress/1?deleted=true",
                expectedData: [expected],
            });
        });

        test("SOFT DELETE /progress/:id/image/:id (superstudent)", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.delete({ url: "/progress/1/image/2" });

            // verify that the progress image is soft deleted
            // super-student should not see the deleted image
            const expected = {
                id: 1,
                report: "Report 1",
                arrival: "2023-05-04T12:00:00.000Z",
                departure: "2023-05-04T12:00:00.000Z",
                building_id: 1,
                schedule_id: 1,
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
                schedule: {
                    id: 1,
                    day: "2023-05-04T12:00:00.000Z",
                    start: "2023-05-04T12:10:00.000Z",
                    end: "2023-05-04T12:20:00.000Z",
                    user_id: 1,
                    round_id: 1,
                    deleted: false,
                    round: {
                        id: 1,
                        name: "Round 1",
                        description: "Description of round 1",
                        deleted: false,
                    },
                    user: {
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
                    },
                },
                images: [],
            };

            await runner.get({
                url: "/progress/1",
                expectedData: [expected],
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
            const timestamp: Date = new Date(Date.UTC(2023, 7, 4, 16, 0, 0));
            const newProgress = {
                report: "Report 2",
                arrival: timestamp,
                departure: timestamp,

                building_id: 1,
                schedule_id: 1,
            };

            const newImage = {
                image_id: 2,
                type: "ARRIVAL",
                description: "arrival image",
            };

            describe("Cannot reach any path without authorisation", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.UNAUTHORIZED);
                });

                test("Cannot reach GET /progress", async () => {
                    await runner.get({
                        url: "/progress",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach GET /progress/:id", async () => {
                    await runner.get({
                        url: "/progress/1",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /progress", async () => {
                    await runner.post({
                        url: "/progress",
                        data: newProgress,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /progress/:id", async () => {
                    await runner.patch({
                        url: "/progress/1",
                        data: newProgress,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /progress/:id", async () => {
                    await runner.delete({
                        url: "/progress/1",
                        statusCode: 403,
                    });
                });

                test("Cannot reach POST /progress/:id/image", async () => {
                    await runner.post({
                        url: "/progress/1/image",
                        data: newImage,
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach PATCH /progress/:id/image/:id", async () => {
                    await runner.patch({
                        url: "/progress/1/image/1",
                        data: { description: "REST" },
                        expectedResponse: forbiddenResponse,
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /progress/:id/image/:id", async () => {
                    await runner.delete({
                        url: "/progress/1/image/1",
                        statusCode: 403,
                    });
                });
            });
            describe("Cannot reach any path as a student", () => {
                beforeEach(() => {
                    runner.authLevel(AuthenticationLevel.STUDENT);
                });

                test("Cannot reach GET /progress", async () => {
                    await runner.get({
                        url: "/progress",
                        expectedData: [forbiddenResponse],
                        statusCode: 403,
                    });
                });

                test("Cannot reach DELETE /progress/:id", async () => {
                    await runner.delete({
                        url: "/progress/1",
                        statusCode: 403,
                    });
                });
            });
        });
        describe("The requested path must exist", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("Find a nonexistent progress", async () => {
                await runner.get({
                    url: "/progress/100",
                    expectedData: [notFoundResponse],
                    statusCode: 404,
                });
            });

            test("Update a nonexistent progress", async () => {
                const timestamp: Date = new Date(
                    Date.UTC(2023, 7, 4, 16, 0, 0),
                );
                const newProgress = {
                    report: "Report 2",
                    arrival: timestamp,
                    departure: timestamp,

                    building_id: 1,
                    schedule_id: 1,
                };

                await runner.patch({
                    url: "/progress/100",
                    data: newProgress,
                    expectedResponse: notFoundResponse,
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent progress", async () => {
                await runner.delete({ url: "/progress/100", statusCode: 404 });
            });

            test("Update a nonexistent progress image", async () => {
                const newImage = {
                    description: "REST",
                };

                await runner.patch({
                    url: "/progress/1/image/100",
                    data: newImage,
                    expectedResponse: { message: "Not Found" },
                    statusCode: 404,
                });
            });
            test("Delete a nonexistent progress image", async () => {
                await runner.delete({
                    url: "/progress/1/image/100",
                    statusCode: 404,
                });
            });
        });
        describe("The type of progress id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("GET request", async () => {
                await runner.get({
                    url: "/progress/wrongtype",
                    expectedData: [badRequestResponse],
                    statusCode: 400,
                });
            });

            test("PATCH request", async () => {
                const timestamp: Date = new Date(
                    Date.UTC(2023, 7, 4, 16, 0, 0),
                );
                const newProgress = {
                    report: "Report 2",
                    arrival: timestamp,
                    departure: timestamp,

                    building_id: 1,
                    schedule_id: 1,
                };
                await runner.patch({
                    url: "/progress/wrongtype",
                    data: newProgress,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/progress/wrongtype",
                    statusCode: 400,
                });
            });
        });

        describe("The type of progress image id must be correct", () => {
            beforeEach(() => {
                runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            });

            test("PATCH request", async () => {
                const newImage = {
                    description: "REST",
                };

                await runner.patch({
                    url: "/progress/1/image/wrongtype",
                    data: newImage,
                    expectedResponse: badRequestResponse,
                    statusCode: 400,
                });
            });

            test("DELETE request", async () => {
                await runner.delete({
                    url: "/progress/1/image/wrongtype",
                    statusCode: 400,
                });
            });
        });
    });
    afterAll(() => {
        app.close();
    });
});
