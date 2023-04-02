import app from "../../src/main";
// @ts-ignore
import request from "supertest";
// @ts-ignore
import supertest from "supertest";

// Schedule die toegevoegd zal worden om mee te werken bij de testen
const scheduleToCreate = {
    day: "2020-01-01T00:00:00.000Z",
    user_id: undefined,
    round_id: undefined,
};

const schedule = {
    id: undefined,
    day: "2020-01-01T00:00:00.000Z",
    user_id: undefined,
    user: undefined,
    round_id: undefined,
    round: undefined,
    deleted: false,
};

// schakel authenticatie in, ongeacht wat de runner in zijn .env heeft
process.env["DISABLE_AUTH"] = "false";

// Voor de testen uitgevoerd worden, moet de sessie gestart worden en moet autorisatie verkregen en bewaard worden.
// Daarnaast moeten bepaalde waarden aan de databank toegevoegd worden die gebruikt zullen worden in de testen.
async function prepareSession(): Promise<[supertest.SuperTest<any>, string]> {
    // Sessie starten en inloggen om autorisatie te krijgen
    const session = request(app);
    const resultLogin = await session
        .post("/auth/login")
        .send({ username: "jens.pots@ugent.be", password: "password" });
    expect(resultLogin.status).toBe(302);
    expect(resultLogin.headers).toHaveProperty("set-cookie");

    // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
    const cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

    // Een willekeurige ronde en gebruiker nemen om te gebruiken voor het maken van de schedule
    const user = await session.get("/user").set("Cookie", [cookies]);
    expect(user.status).toEqual(200);
    scheduleToCreate.user_id = user.body[0].id;
    schedule.user_id = user.body[0].id;
    delete user.body[0].regions;
    schedule.user = user.body[0];

    const round = await session.get("/round").set("Cookie", [cookies]);
    expect(round.status).toEqual(200);
    scheduleToCreate.round_id = round.body[0].id;
    schedule.round_id = round.body[0].id;
    schedule.round = round.body[0];

    // Nieuwe schedule toevoegen die gebruikt wordt bij de testen
    const resultAdd = await session
        .post("/schedule")
        .send(scheduleToCreate)
        .set("Cookie", [cookies]);
    expect(resultAdd.status).toEqual(201);
    schedule.id = resultAdd.body["id"];

    return [session, cookies];
}

async function closeSession(
    session: supertest.SuperTest<any>,
    cookies: string,
) {
    const resultDelete = await session
        .delete("/schedule/" + schedule.id)
        .send({ hardDelete: true })
        .set("Cookie", [cookies]);
    expect(resultDelete.status).toEqual(200);
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
        closeSession(session, cookies);
    });

    test("Test searching existing schedule", async () => {
        const result = await session
            .get("/schedule/" + schedule.id)
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(schedule);
    });

    test("Test updating existing schedule", async () => {
        const change = "2023-01-01T00:00:00.000Z";
        const scheduleUpdated = {
            id: schedule.id,
            day: change,
            user_id: schedule.user_id,
            round_id: schedule.round_id,
            deleted: schedule.deleted,
        };

        const result = await session
            .patch("/schedule/" + schedule.id)
            .send({ day: change })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(scheduleUpdated);

        schedule.day = change;
    });

    // Deze test verwijderd een schedule niet definitief uit de databank (soft delete).
    test("Test soft deleting an existing schedule", async () => {
        schedule.deleted = true;

        const result = await session
            .delete("/schedule/" + schedule.id)
            .send({ hardDelete: false })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({});

        console.log(JSON.stringify(schedule));
        const resultGet = await session
            .get("/schedule/" + schedule.id)
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(200);
        expect(resultGet.body).toEqual(schedule);
    });
});

// Deze testen kijken na of de juiste foutcodes worden gestuurd als verkeerde requests worden gestuurd
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

    // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
    test("Test authorization", async () => {
        const resultGet = await session.get("/schedule");
        expect(resultGet.status).toEqual(403);
        expect(resultGet.forbidden).toEqual(true);

        const resultGetId = await session.get("/schedule/" + schedule.id);
        expect(resultGetId.status).toEqual(403);
        expect(resultGetId.forbidden).toEqual(true);

        const resultAdd = await session
            .post("/schedule")
            .send(scheduleToCreate);
        expect(resultAdd.status).toEqual(403);
        expect(resultAdd.forbidden).toEqual(true);

        const resultUpdate = await session
            .patch("/schedule/" + schedule.id)
            .send(scheduleToCreate);
        expect(resultUpdate.status).toEqual(403);
        expect(resultUpdate.forbidden).toEqual(true);

        const resultDelete = await session.delete("/schedule/" + schedule.id);
        expect(resultDelete.status).toEqual(403);
        expect(resultDelete.forbidden).toEqual(true);
    });

    // Deze test probeert de id's van user en round te wijzigen naar onbestaande id's
    test("Test change id to unexisting id", async () => {
        const resultUser = await session
            .patch("/schedule/" + schedule.id)
            .send({ user_id: 0 })
            .set("Cookie", [cookies]);
        expect(resultUser.status).toEqual(500);

        const resultRound = await session
            .patch("/schedule/" + schedule.id)
            .send({ round_id: 0 })
            .set("Cookie", [cookies]);
        expect(resultRound.status).toEqual(500);
    });

    // Deze test probeert requests uit te voeren op een onbestaand schedule
    test("Test using an unexisting schedule", async () => {
        const resultGet = await session
            .get("/schedule/0")
            .set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(404);
        expect(resultGet.notFound).toEqual(true);

        const resultUpdate = await session
            .patch("/schedule/0")
            .send({ day: "2022-01-01T00:00:00.000Z" })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toEqual(404);
        expect(resultUpdate.notFound).toEqual(true);

        const resultDelete = await session
            .delete("/schedule/0")
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(404);
        expect(resultDelete.notFound).toEqual(true);
    });

    // Deze test gebruikt foute types bij het aanpassen van een schedule
    test("Test use wrong types", async () => {
        // boolean in plaats van datetime
        const result1 = await session
            .patch("/schedule/" + schedule.id)
            .send({ day: false })
            .set("Cookie", [cookies]);
        expect(result1.status).toEqual(400);
        expect(result1.badRequest).toEqual(true);

        // string in plaats van getal
        const result2 = await session
            .patch("/schedule/" + schedule.id)
            .send({ user_id: "5" })
            .set("Cookie", [cookies]);
        expect(result2.status).toEqual(400);
        expect(result2.badRequest).toEqual(true);

        // string in plaats van datetime
        const result3 = await session
            .patch("/schedule/" + schedule.id)
            .send({ day: "dag" })
            .set("Cookie", [cookies]);
        expect(result3.status).toEqual(400);
        expect(result3.badRequest).toEqual(true);
    });
});

app.close();
