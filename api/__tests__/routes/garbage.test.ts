import app from "../../src/main";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";
import supertest from "supertest";

// Garbage die toegevoegd zal worden om mee te werken bij de testen
const garbageToCreate = {
    pickup_time: "2023-01-01T00:00:00.000Z",
    action_id: undefined,
    building_id: undefined,
};

const garbage = {
    id: undefined,
    pickup_time: "2023-01-01T00:00:00.000Z",
    action_id: undefined,
    action: {
        id: undefined,
        description: "Action for testing",
    },
    building_id: undefined,
    building: {
        id: undefined,
        name: undefined,
        ivago_id: undefined,
        deleted: undefined,
        address: undefined,
    },
};

// schakel authenticatie in, ongeacht wat de runner in zijn .env heeft
process.env["DISABLE_AUTH"] = "false";

// Voor de testen uitgevoerd worden, moet de sessie gestart worden en moet autorisatie verkregen en bewaard worden.
// Daarnaast moeten bepaalde waarden aan de databank toegevoegd worden die gebruikt zullen worden in de testen.
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

    // Een nieuwe action toevoegen om te gebruiken bij de testen
    let res = await session
        .post("/action")
        .send({ description: "Action for testing" })
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(201);
    garbageToCreate.action_id = res.body.id;
    garbage.action_id = res.body.id;

    // Een willekeurig gebouw nemen om te gebruiken bij de testen
    res = await session.get("/building").set("Cookie", [cookies]);
    expect(res.status).toEqual(200);
    const buildings = res.body;
    expect(buildings.length).toBeGreaterThan(0);
    const building = buildings[0];
    garbageToCreate.building_id = building.id;
    garbage.building_id = building.id;
    garbage.building.id = building.id;
    garbage.building.name = building.name;
    garbage.building.ivago_id = building.ivago_id;
    garbage.building.deleted = building.deleted;
    garbage.building.address = building.address;

    // Nieuwe schedule toevoegen die gebruikt wordt bij de testen
    res = await session
        .post("/garbage")
        .send(garbageToCreate)
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(201);
    garbage.id = res.body["id"];
    const newGarbage = res.body;
    garbage.action_id = newGarbage.action_id;
    garbage.action.id = newGarbage.action_id;

    return [session, cookies];
}

async function closeSession(
    session: supertest.SuperTest<any>,
    cookies: string,
) {
    let res = await session
        .delete("/garbage/" + garbage.id)
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(200);

    res = await session
        .delete("/action/" + garbage.action_id)
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(200);
}

describe("Successful tests", () => {
    let session: supertest.SuperTest<any>;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    afterAll(async () => {
        await closeSession(session, cookies);
    });

    test("Test searching existing garbage", async () => {
        const res = await session
            .get("/garbage/" + garbage.id)
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(garbage);
    });

    test("Test updating existing garbage", async () => {
        const change = "2023-02-02T00:00:00.000Z";
        const updatedGarbage = {
            id: garbage.id,
            pickup_time: change,
            action_id: garbage.action_id,
            building_id: garbage.building_id,
        };

        const res = await session
            .patch("/garbage/" + garbage.id)
            .send({ pickup_time: change })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(updatedGarbage);
    });
});

describe("Unsuccessful tests", () => {
    let session: supertest.SuperTest<any>;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    afterAll(async () => {
        await closeSession(session, cookies);
    });

    test("Test Authorization", async () => {
        let res = await session.get("/garbage");
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.get("/garbage/" + garbage.id);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.post("/garbage").send(garbageToCreate);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ pickup_time: "2023-02-02T00:00:00.000Z" });
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.delete("/garbage/" + garbage.id);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);
    });

    test("Test change id to unexisting id", async () => {
        let res = await session
            .patch("/garbage/" + garbage.id)
            .send({ action_id: 0 })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(500);

        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ building_id: 0 })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(500);
    });

    test("Test using an unexisting garbage", async () => {
        let res = await session.get("/garbage/0").set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);

        res = await session
            .patch("/garbage/0")
            .send({ pickup_time: "2023-02-02T00:00:00.000Z" })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);

        res = await session.delete("/garbage/0").set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);
    });

    test("Test using wrong types", async () => {
        // string in plaats van date
        let res = await session
            .patch("/garbage/" + garbage.id)
            .send({ pickup_time: "date" })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);

        // getal in plaats van date
        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ pickup_time: 2023 })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);

        // boolean in plaats van date
        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ pickup_time: true })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);

        // string in plaats van getal
        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ action_id: "one" })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);

        // boolean in plaats van getal
        res = await session
            .patch("/garbage/" + garbage.id)
            .send({ action_id: true })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);
    });
});

app.close();
