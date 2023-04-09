import request from "supertest";
import "jest-expect-message";

const credentials = {
    username: "administrator@trottoir.be",
    password: "password",
};

/**
 * Describes different authentication levels.
 *
 * Default authentication level is UNAUTHORIZED
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

/**
 * Class that encompasses all the common actions for running tests.
 *
 * Use this class when testing the API.
 */
export class Testrunner {
    // reference to the server
    private readonly server: request.SuperTest<request.Test>;

    /** Testrunner has a private to ensure the only way to create Testrunner class is through the Singleton.
     *
     */
    public constructor(server: request.SuperTest<any>) {
        this.server = server;
    }

    /**
     * Aquires authentication and performs a GET request to the passed URL.
     * @param url url to test
     * @param expectedData data that must be received
     * @param authenticationLevel expected level of authentication
     */
    get = async (
        url: string,
        expectedData: {}[],
        authenticationLevel: AuthenticationLevel,
    ) => {
        const cookie = await this.authenticate(authenticationLevel);

        const response = await this.server.get(url).set("Cookie", [cookie]);
        expect(response.statusCode, "Authorisation level is too low", {
            showPrefix: false,
        }).toEqual(200);

        // verify everything that is required is received
        for (const item of response.body) {
            expect(expectedData).toContainEqual(item);
        }

        // verify that only stuff that is required is received
        expect(response.body.length, "Received too much or too little data!", {
            showPrefix: false,
        }).toEqual(expectedData.length);
    };

    /**
     * Obtains cookies from the server for authentication
     */
    private authenticate = async (
        authLevel: AuthenticationLevel,
    ): Promise<string> => {
        // if unauthorized, no cookies are set
        if (authLevel === AuthenticationLevel.UNAUTHORIZED) {
            return "";
        }

        const credentials = credentialsMap[authLevel];
        console.log(credentials);
        const response = await this.server
            .post("/auth/login")
            .send(credentials);

        // verify we got the correct response
        expect(response.status).toEqual(302);
        expect(response.headers).toHaveProperty("set-cookie");

        return response.headers["set-cookie"].pop().split(";")[0];
    };
}
