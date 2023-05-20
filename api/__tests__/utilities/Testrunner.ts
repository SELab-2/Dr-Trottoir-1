import request from "supertest";
import { expect } from "@jest/globals";
import { constants } from "http2";

/**
 * Describes different authentication levels.
 *
 * Default authentication level is UNAUTHORIZED.
 *
 * AuthenticationLevel gets specified in the test to run the test suite at that Authentication level.
 */
export enum AuthenticationLevel {
    UNAUTHORIZED,
    STUDENT,
    SUPER_STUDENT,
    ADMINISTRATOR,
    SYNDICUS,
}

const credentialsMap: {
    [key in AuthenticationLevel]?: { username: string; password: string };
} = {
    [AuthenticationLevel.STUDENT]: {
        username: "student@trottoir.be",
        password: "student",
    },
    [AuthenticationLevel.SUPER_STUDENT]: {
        username: "superstudent@trottoir.be",
        password: "super_student",
    },
    [AuthenticationLevel.ADMINISTRATOR]: {
        username: "administrator@trottoir.be",
        password: "administrator",
    },
    [AuthenticationLevel.SYNDICUS]: {
        username: "syndicus@trottoir.be",
        password: "syndicus",
    },
};

interface GetParameters {
    url: string;
    expectedData: object[];
    statusCode?: number;
}

interface PostParameters {
    url: string;
    data: object;
    expectedResponse: object;
    statusCode?: number;
}

interface PostParametersFile {
    url: string;
    expectedResponse: object;
    statusCode?: number;
    file: string;
}

interface GetFileParameters {
    url: string;
    expectedContents: string;
    statusCode?: number;
}

interface PatchParameters {
    url: string;
    data: object;
    expectedResponse: object;
    statusCode?: number;
}

interface DeleteParameters {
    url: string;
    statusCode?: number;
    data?: object;
}

/**
 * Class that encompasses all the common actions for running tests.
 *
 * Use this class when testing the API.
 */
export class Testrunner {
    // reference to the server
    private readonly server: request.SuperTest<request.Test>;
    private authenticationLevel: AuthenticationLevel =
        AuthenticationLevel.UNAUTHORIZED;

    /**
     * @param server reference to the server wrapped in SuperTest
     */
    public constructor(server: request.SuperTest<any>) {
        this.server = server;
    }

    authLevel = (authLevel: AuthenticationLevel) => {
        this.authenticationLevel = authLevel;
    };

    /**
     * Acquires authentication if required and performs a GET request to the passed URL.
     * Also performs verification of the response.
     * @param url url to test
     * @param expectedData data that must be received
     * @param statusCode expected status code of the response. Suppose testing of different authentication levels, set this property to make the test expect the correct status code
     * @return the Response object for further testing, should it be required.
     */
    get = async ({
        url,
        expectedData,
        statusCode = 200,
    }: GetParameters): Promise<request.Response> => {
        const cookie = await this.authenticate();

        const response = await this.server.get(url).set("Cookie", [cookie]);
        expect(response.statusCode).toEqual(statusCode);
        this.verifyBody(expectedData, response);

        return response;
    };

    /**
     * Acquires authentication if required and performs a GET request to the passed URL.
     * @param url URL of the file
     * @param expectedContents Contents the file should have
     * @param statusCode expected status code of the response.
     * @return the Response object for further testing, should it be required
     */
    getFile = async ({
        url,
        expectedContents,
        statusCode = 200,
    }: GetFileParameters): Promise<request.Response> => {
        const cookie: string = await this.authenticate();
        const response = await this.server.get(url).set("Cookie", [cookie]);

        expect(response.statusCode).toEqual(statusCode);
        expect(response.text).toEqual(expectedContents);

        return response;
    };

    /**
     * Acquires authentication and performs a GET method on the URL, without doing any testing
     * Useful for getting the responses from the API and capturing them in the test suites
     * @param url URL to GET
     */
    getRaw = async (url: string) => {
        const cookie = await this.authenticate();
        return this.server.get(url).set("Cookie", [cookie]);
    };

    /**
     * Acquires authentication if required and performs a POST request to the passed URL.
     * Also performs verification on the response.
     * @param url URL to POST to
     * @param data data to be sent
     * @param expectedResponse Response that should be received from the Request
     * @param statusCode expected status code of the response. Suppose testing of different authentication levels, set this property to make the test expect the correct status code
     * @return the Response object for further testing, should it be required.
     */
    post = async ({
        url,
        data,
        expectedResponse,
        statusCode = constants.HTTP_STATUS_CREATED,
    }: PostParameters): Promise<request.Response> => {
        const cookie = await this.authenticate();

        const response = await this.server
            .post(url)
            .send(data)
            .set("Cookie", [cookie]);
        expect(response.statusCode).toEqual(statusCode);
        // drop the id, as we cannot predict that
        delete response.body["id"];

        this.verifyBody([expectedResponse], response);

        return response;
    };

    /**
     * Acquires authentication if required and performs a POST request to the passed URL.
     * Also performs verification on the response.
     * @param url URL to POST to
     * @param file file path on current host
     * @param statusCode expected status code of the response. Suppose testing of different authentication levels, set this property to make the test expect the correct status code
     * @return the Response object for further testing, should it be required.
     */

    postFile = async ({
        url,
        expectedResponse,
        statusCode = constants.HTTP_STATUS_CREATED,
        file,
    }: PostParametersFile): Promise<request.Response> => {
        const cookie = await this.authenticate();

        const response = await this.server
            .post(url)
            .set("Cookie", [cookie])
            .attach("file", file);
        expect(response.statusCode).toEqual(statusCode);

        // drop the id, as we cannot predict that
        delete response.body["id"];
        // drop createdAt, updatedAt as we cannot predict that with each test
        delete response.body["createdAt"];
        delete response.body["updatedAt"];
        // drop path as we cannot predict that
        delete response.body["path"];

        this.verifyBody([expectedResponse], response);

        return response;
    };

    /**
     * Acquires authentication if required and performs a PATCH request to the URL.
     * Also performs verification on the response.
     * @param url URL to PATCH to
     * @param data data to be sent
     * @param expectedResponse Dictionary of keys and values PATCH should receive
     * @param statusCode expected status code of the response. Suppose testing of different authentication levels, set this property to make the test expect the correct status code
     * @return the Response object for further testing, should it be required.
     */
    patch = async ({
        url,
        data,
        expectedResponse,
        statusCode = 200,
    }: PatchParameters): Promise<request.Response> => {
        const cookie = await this.authenticate();

        const response = await this.server
            .patch(url)
            .send(data)
            .set("Cookie", [cookie]);

        expect(response.statusCode).toEqual(statusCode);

        this.verifyBody([expectedResponse], response);

        return response;
    };

    /**
     * Acquires authentication if required and performs a DELETE  request to the URL.
     * Also performs verification on the response.
     * @param url URL to perform DELETE on
     * @param statusCode expected status code of the response. Suppose testing of different authentication levels, set this property to make the test expect the correct status code
     * @param data data/parameters to send with the Request, such as soft deletes
     * @return the Response object for further testing, should it be required.
     */
    delete = async ({
        url,
        statusCode = 200,
        data = {},
    }: DeleteParameters): Promise<request.Response> => {
        const cookie = await this.authenticate();

        const response = await this.server
            .delete(url)
            .send(data)
            .set("Cookie", [cookie]);

        expect(response.statusCode).toEqual(statusCode);

        return response;
    };

    /**
     * Obtains cookies from the server for authentication
     */
    private authenticate = async (): Promise<string> => {
        // if unauthorized, no cookies are set
        if (this.authenticationLevel === AuthenticationLevel.UNAUTHORIZED) {
            return "";
        }
        const credentials = credentialsMap[this.authenticationLevel];
        const response = await this.server
            .post("/auth/login")
            .send(credentials);

        // verify we got the correct response
        expect(response.status).toEqual(constants.HTTP_STATUS_FOUND);
        expect(response.headers).toHaveProperty("set-cookie");

        return response.headers["set-cookie"].pop().split(";")[0];
    };

    /**
     * Verifies that the received body of the API call contains the expected values
     * @param expected list of expected values
     * @param response response to be verified
     * @private
     */
    private verifyBody(expected: object[], response: request.Response): void {
        if (response.body instanceof Array) {
            for (const item of expected) {
                expect(response.body).toContainEqual(
                    JSON.parse(JSON.stringify(item)),
                );
            }
        } else {
            // if body is a single object, expected array should only contain a single element
            expect(JSON.parse(JSON.stringify(response.body))).toEqual(
                JSON.parse(JSON.stringify(expected[0])),
            );
        }
    }
}
