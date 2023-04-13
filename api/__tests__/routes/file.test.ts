import app from "../../src/main";
import request from "supertest";
import supertest from "supertest";
import { describe, expect, test } from "@jest/globals";
import * as fs from "fs";

const fileToCreate = {
    path: "/filee/blanc.png",
    location: "FILE_SERVER",
    file: fs.createReadStream("/home/ludovic/Pictures/blanc.png"),
};

const file = {
    id: undefined,
    path: "/filee/blanc.png",
    user_id: undefined,
    user: undefined,
    location: "FILE_SERVER",
};

process.env["DISABLE_AUTH"] = "false";

async function prepareSession(): Promise<[supertest.SuperTest<any>, string]> {
    // Sessie starten en inloggen om autorisatie te krijgen
    const session = request(app);
    const resultLogin = await session.post("/auth/login").send({
        username: "administrator@trottoir.be",
        password: "password",
    });
    expect(resultLogin.status).toBe(302);
    expect(resultLogin.headers).toHaveProperty("set-cookie");

    // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
    const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

    // Een willekeurige ronde en gebruiker nemen om te gebruiken voor het maken van de schedule
    // const user = await session.get("/user").set("Cookie", [cookies]);
    // expect(user.status).toEqual(200);
    // fileToCreate.user_id = user.body[0].id;
    // //file.user_id = user.body[0].id;
    // //delete user.body[0].regions;
    // file.user = user.body[0];

    // const resultAdd = await session
    //     .post("/file")
    //     .send(fileToCreate)
    //     .set("Cookie", [cookies]);
    // expect(resultAdd.status).toEqual(201);

    return [session, cookies];
}

describe("Test FileRouting successful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });
    afterAll(async () => {
        //await closeSession(session, cookies);
    });

    test("Test adding file", async () => {
        const resultAdd = await session
            .post("/file")
            .send(fileToCreate)
            .set("Cookie", [cookies]);
        expect(resultAdd.status).toEqual(200);
    });

    test("Test searching existing file", async () => {
        const result = await session
            .get("/file/" + "47")
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        //expect(result.body).toEqual(file);
    });
});

describe("Test BuildingRouting unsuccessful tests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        session = request(app);
    });

    // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
    test("Test authorization", async () => {
        const resultGet = await session.get("/file/47");
        expect(resultGet.status).toEqual(401);

        const resultAdd = await session.post("/file").send(fileToCreate);
        expect(resultAdd.status).toEqual(401);
    });
});
