import app from "../../src/main";
import supertest from "supertest";
import request from "supertest";
import { describe, expect, test } from "@jest/globals";

// De gebruiker die voor het uitvoeren van de testen toegevoegd en verwijderd zal worden aan de databank.
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

/*
Bij userToCreate heeft bij het veld address een andere constructie zodat een nieuw adres toegevoegd kan worden aan de
databank en heeft de extra waarden hash en salt.
Hierdoor wordt deze variabele ook gemaakt om in de testen zelf gebruikt te worden, aangezien de waarden
hash en salt niet meegegeven mogen worden in het resultaat van een query.
 */
const user = {
    id: undefined,
    email: "admin@email.com",
    first_name: "admin",
    last_name: "familyname",
    date_added: "2020-01-01T00:00:00.000Z",
    last_login: "2020-01-01T00:00:00.000Z",
    phone: "number",
    address: {
        id: undefined,
        city: "Gent",
        latitude: 100.0,
        longitude: 100.0,
        number: 1,
        street: "street",
        zip_code: 1000,
    },
    address_id: undefined,
    student: false,
    super_student: false,
    admin: true,
    deleted: false,
    regions: [],
};

// schakel authenticatie in, ongeacht wat de runner in zijn .env heeft
process.env["DISABLE_AUTH"] = "false";

// Voor de testen uitgevoerd worden, moet de sessie gestart worden en moet autorisatie verkregen en bewaard worden.
// Daarnaast moeten bepaalde waarden aan de databank toegevoegd worden die gebruikt zullen worden in de testen.
async function prepareSession(): Promise<
    [supertest.SuperTest<supertest.Test>, string]
> {
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

    // Nieuwe user toevoegen die gebruikt wordt bij de testen
    const resultAdd = await session
        .post("/user")
        .send(userToCreate)
        .set("Cookie", [cookies]);
    expect(resultAdd.status).toEqual(201);
    user.id = resultAdd.body["id"];
    user.address.id = resultAdd.body["address_id"];
    user.address_id = resultAdd.body["address_id"];

    return [session, cookies];
}

async function closeSession(
    session: supertest.SuperTest<supertest.Test>,
    cookies: string,
) {
    const resultDelete = await session
        .delete("/user/" + user.id)
        .send({ hardDelete: true })
        .set("Cookie", [cookies]);
    expect(resultDelete.status).toEqual(200);
}

describe("Test UserRouting successful requests", () => {
    let session: supertest.SuperTest<supertest.Test>;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    // Na het uitvoeren van alle testen moet de gebruiker terug verwijderd worden uit de databank.
    afterAll(async () => {
        await closeSession(session, cookies);
    });

    test("Test searching existing user", async () => {
        const result = await session
            .get("/user/" + user.id)
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(user);
    });

    test("Test updating existing user", async () => {
        const updatedUser = {
            id: user.id,
            email: "new.mail@email.com",
            first_name: user.first_name,
            last_name: user.last_name,
            date_added: user.date_added,
            last_login: user.last_login,
            phone: user.phone,
            address_id: user.address_id,
            address: user.address,
            student: false,
            super_student: true,
            admin: true,
            deleted: false,
            regions: [],
        };

        const result = await session
            .patch("/user/" + user.id)
            .send({ email: updatedUser.email, super_student: true })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(updatedUser);
    });

    // Deze test controleert de werking van soft delete bij het verwijderen van een user
    test("Test soft delete of existing user", async () => {
        const result = await session
            .delete("/user/" + user.id)
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual({});

        user.deleted = true;
    });
});

describe("Test UserRouting unsuccessful requests", () => {
    let session: supertest.SuperTest<supertest.Test>;
    let cookies: string;

    beforeAll(async () => {
        const session_cookies = await prepareSession();
        session = session_cookies[0];
        cookies = session_cookies[1];
    });

    // Na het uitvoeren van alle testen moet de gebruiker terug verwijderd worden uit de databank.
    afterAll(async () => {
        await closeSession(session, cookies);
    });

    // Bij deze test wordt er niet ingelogd en heeft de sessie dus geen autorisatie om request uit te voeren.
    test("Test authorization", async () => {
        const session = await request(app);

        await session.get("/user").expect(403);

        await session.get("/user/" + user.id).expect(403);

        const resultAdd = await session.post("/user").send(userToCreate);
        expect(resultAdd.status).toEqual(403);
        expect(resultAdd.forbidden).toEqual(true);

        const resultUpdate = await session
            .patch("/user/" + user.id)
            .send({ student: true });
        expect(resultUpdate.status).toEqual(403);
        expect(resultUpdate.forbidden).toEqual(true);

        const resultDelete = await session.delete("/user/" + user.id);
        expect(resultDelete.status).toEqual(403);
        expect(resultDelete.forbidden).toEqual(true);
    });

    // Deze test probeert een nieuwe gebruiker aan te maken met een email dat al bestaat
    test("Test adding existing email", async () => {
        const result = await session
            .post("/user")
            .send(userToCreate)
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(409);
        expect(result.text).toEqual(
            '{"message":"Conflict","detail":"Unique constraint failed"}',
        );
    });

    // Deze test probeert het address_id van de gebruiker aan te passen naar een onbestaand address_id
    test("Test changing address_id to unexisting id", async () => {
        const result = await session
            .patch("/user/" + user.id)
            .send({ address_id: 0 })
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(500);
    });

    // Deze test probeert requests uit te voeren op een onbestaande gebruiker
    test("Test using an unexisting user", async () => {
        const resultGet = await session.get("/user/0").set("Cookie", [cookies]);
        expect(resultGet.status).toEqual(404);
        expect(resultGet.notFound).toEqual(true);

        const resultUpdate = await session
            .patch("/user/0")
            .send({ student: true })
            .set("Cookie", [cookies]);
        expect(resultUpdate.status).toBe(404);
        expect(resultUpdate.notFound).toEqual(true);

        const resultDelete = await session
            .delete("/user/0")
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(404);
        expect(resultDelete.notFound).toEqual(true);
    });

    // Deze test gebruikt foute types bij het toevoegen/ aanpassen van een gebruiker
    test("Test using wrong type", async () => {
        // String in plaats van boolean
        const result1 = await session
            .patch("/user/" + user.id)
            .send({ student: "fout type" })
            .set("Cookie", [cookies]);
        expect(result1.status).toEqual(400);
        expect(result1.badRequest).toEqual(true);

        // String in plaats van datum
        const result2 = await session
            .patch("/user/" + user.id)
            .send({ last_login: "string in plaats van datum" })
            .set("Cookie", [cookies]);
        expect(result2.status).toEqual(400);
        expect(result2.badRequest).toEqual(true);

        // Getal in plaats van string
        const result3 = await session
            .patch("/user/" + user.id)
            .send({ first_name: 5 })
            .set("Cookie", [cookies]);
        expect(result3.status).toEqual(400);
        expect(result3.badRequest).toEqual(true);

        // Boolean in plaats van string
        const result4 = await session
            .patch("/user/" + user.id)
            .send({ first_name: true })
            .set("Cookie", [cookies]);
        expect(result4.status).toEqual(400);
        expect(result4.badRequest).toEqual(true);
    });

    // Deze test probeert hash en salt waarden mee te geven
    test("Test sending hash or salt", async () => {
        const userWithHash = {
            ...userToCreate,
            hash: "hashvalue",
        };

        const userWithSalt = {
            ...userToCreate,
            salt: "saltvalue",
        };

        const resultHash1 = await session
            .post("/user")
            .send(userWithHash)
            .set("Cookie", [cookies]);
        expect(resultHash1.status).toEqual(400);
        expect(resultHash1.badRequest).toEqual(true);

        const resultHash2 = await session
            .patch("/user/" + user.id)
            .send({ hash: "newhash" })
            .set("Cookie", [cookies]);
        expect(resultHash2.status).toEqual(400);
        expect(resultHash2.badRequest).toEqual(true);

        const resultSalt1 = await session
            .post("/user")
            .send(userWithSalt)
            .set("Cookie", [cookies]);
        expect(resultSalt1.status).toEqual(400);
        expect(resultSalt1.badRequest).toEqual(true);

        const resultSalt2 = await session
            .patch("/user/" + user.id)
            .send({ salt: "newsalt" })
            .set("Cookie", [cookies]);
        expect(resultSalt2.status).toEqual(400);
        expect(resultSalt2.badRequest).toEqual(true);
    });
});

app.close();
