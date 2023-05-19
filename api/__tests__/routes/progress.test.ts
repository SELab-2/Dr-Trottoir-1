import { describe } from "@jest/globals";
import { AuthenticationLevel, Testrunner } from "../utilities/Testrunner";
import request from "supertest";
import app from "../../src/main";
import { resetDatabase } from "../mock/database";
import { image } from "../mock/file";

describe("Progress tests", () => {
    let runner: Testrunner;
    beforeAll(async () => {
        const server = request(app);
        runner = new Testrunner(server);

        runner.authLevel(AuthenticationLevel.SUPER_STUDENT);

        return resetDatabase();
    });

    describe("Bugs", () => {
        test("Superstudent must not see deleted progress images", async () => {
            runner.authLevel(AuthenticationLevel.SUPER_STUDENT);
            await runner.delete({ url: `/progress/1/image/${image.id}` });

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

            // Administrator should see the deleted image
            const adminExpected = {
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
                images: [
                    {
                        deleted: true,
                        description: "Description of progress image 1",
                        id: 1,
                        image: image,
                        image_id: 2,
                        progress_id: 1,
                        type: "ARRIVAL",
                    },
                ],
            };

            runner.authLevel(AuthenticationLevel.ADMINISTRATOR);
            await runner.get({
                url: "/progress/1",
                expectedData: [adminExpected],
            });
        });
    });

    afterAll(() => {
        app.close();
    });
});