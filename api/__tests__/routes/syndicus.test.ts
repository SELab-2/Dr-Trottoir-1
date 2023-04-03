import app from "../../src/main";
// @ts-ignore
import request from "supertest";
// @ts-ignore
import supertest from "supertest";

// User die toegevoegd zal worden om mee te werken bij de testen
const userToCreate = {
    email: "admin@email.com",
    first_name: "admin",
    last_name: "familyname",
    date_added: "2020-01-01T00:00:00.000Z",
    last_login: "2020-01-01T00:00:00.000Z",
    phone: "number",
    address: {
        create: {
            city: "Gent",
            latitude: 100.0,
            longitude: 100.0,
            number: 1,
            street: "street",
            zip_code: 1000,
        },
    },
    address_id: undefined,
    student: false,
    super_student: false,
    admin: true,
    password: "adminPassword",
};

// Syndicus die toegevoegd zal worden om mee te werken bij de testen
const syndicusToCreate = {
    user_id: undefined,
};

const syndicus = {
    id: undefined,
    user_id: undefined,
    user: undefined,
    building: [],
};

// schakel authenticatie in, ongeacht wat de runner in zijn .env heeft
process.env["DISABLE_AUTH"] = "false";

// Voor de testen uitgevoerd worden, moet de sessie gestart worden en moet autorisatie verkregen en bewaard worden.
// Daarnaast moeten bepaalde waarden aan de databank toegevoegd worden die gebruikt zullen worden in de testen.
async function prepareSession(): Promise<[supertest.SuperTest<any>, string]> {
    // Sessie starten en inloggen om autorisatie te krijgen
    const session = request(app);
    let res = await session.post("/auth/login").send({
        username: "administrator@trottoir.be",
        password: "password",
    });
    const headers = res.headers;
    expect(res.status).toBe(302);
    expect(headers).toHaveProperty("set-cookie");

    // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
    const cookies = headers["set-cookie"].pop().split(";")[0];

    // Een gebruiker toevoegen om te gebruiken voor het maken van de syndicus
    res = await session
        .post("/user")
        .send(userToCreate)
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(201);
    const user = res.body;
    syndicusToCreate.user_id = user.id;
    syndicus.user_id = user.id;
    delete user.regions;
    syndicus.user = user;

    // Nieuwe schedule toevoegen die gebruikt wordt bij de testen
    res = await session
        .post("/syndicus")
        .send(syndicusToCreate)
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(201);
    const body = res.body;
    expect(body).toHaveProperty("id");
    syndicus.id = body["id"];

    return [session, cookies];
}

async function closeSession(
    session: supertest.SuperTest<any>,
    cookies: string,
) {
    // Toegevoegde user terug verwijderen, dit verwijdert automatisch ook de syndicus (via cascade delete)
    const res = await session
        .delete("/user/" + syndicus.user_id)
        .send({ hardDelete: true })
        .set("Cookie", [cookies]);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({});
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

    test("Test searching existing syndicus", async () => {
        const res = await session
            .get("/syndicus/" + syndicus.id)
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(syndicus);
    });

    test("Test updating existing syndicus", async () => {
        let res = await session.get("/user").set("Cookie", [cookies]);
        expect(res.status).toEqual(200);
        const users = res.body;
        expect(users.length).toBeGreaterThan(0);
        const user = users[0];

        const updatedSyndicus = {
            id: syndicus.id,
            user_id: user.id,
        };

        res = await session
            .patch("/syndicus/" + syndicus.id)
            .send({ user_id: user.id })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(updatedSyndicus);
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

    test("Test authorization", async () => {
        let res = await session.get("/syndicus");
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.get("/syndicus/" + syndicus.id);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.post("/syndicus").send(syndicusToCreate);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session
            .patch("/syndicus/" + syndicus.id)
            .send({ user_id: 1 });
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);

        res = await session.delete("/syndicus/" + syndicus.id);
        expect(res.status).toEqual(403);
        expect(res.forbidden).toEqual(true);
    });

    // Deze test probeert de id's van user te wijzigen naar onbestaande id's
    test("Test changing id to unexisting id", async () => {
        const res = await session
            .patch("/syndicus/" + syndicus.id)
            .send({ user_id: 0 })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(500);
    });

    // Deze test probeert requests uit te voeren op een onbestaande syndicus. Aangezien de id's in de databank beginnen
    // vanaf 1 gebruik ik hier het onbestaande id 0
    test("Test using an unexisting syndicus", async () => {
        let res = await session.get("/syndicus/0").set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);

        res = await session
            .patch("/syndicus/0")
            .send({ user_id: syndicus.user_id })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);

        res = await session.delete("/syndicus/0").set("Cookie", [cookies]);
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);
    });

    // Deze test gebruikt foute types bij het aanpassen van een schedule
    test("Test using wrong type", async () => {
        // string in plaats van int
        let res = await session
            .patch("/syndicus/" + syndicus.id)
            .send({ user_id: "one" })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);

        // boolean in plaats van int
        res = await session
            .patch("/syndicus/" + syndicus.id)
            .send({ user_id: true })
            .set("Cookie", [cookies]);
        expect(res.status).toEqual(400);
        expect(res.badRequest).toEqual(true);
    });
});

app.close();
