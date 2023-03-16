import app from "../../src/main";
// @ts-ignore
import request from "supertest";

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
    salt: "saltvalue",
    hash: "hashvalue",
};

/*
Bij userToCreate heeft bij het veld address een andere constructie zodat een nieuw adres toegevoegd kan worden aan de
databank en heeft de extra waarden hash en salt.
Hierdoor wordt deze variabele ook gemaakt om in de testen zelf gebruikt te worden, aangezien de waarden
hash en salt niet meegegeven mogen worden in het resultaat van een query.
 */
const user = {
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
    id: undefined,
};

describe("Test UserRouting successful requests", () => {
    let session: any;
    let cookies: string;

    beforeAll(async () => {
        // Sessie starten en inloggen om autorisatie te krijgen
        session = request(app);
        const resultLogin = await session
            .post("/auth/login")
            .send({ username: "jens.pots@ugent.be", password: "password" });
        expect(resultLogin.status).toBe(302);
        expect(resultLogin.headers).toHaveProperty("set-cookie");

        // Deze constante zorgt ervoor dat de ingelogde gebruiker behouden blijft en dus autorisatie heeft.
        cookies = resultLogin.headers["set-cookie"].pop().split(";")[0];

        // Nieuwe user toevoegen die gebruikt wordt bij de testen
        const resultAdd = await session
            .post("/user")
            .send(userToCreate)
            .set("Cookie", [cookies]);
        expect(resultAdd.status).toEqual(201);
        user.id = resultAdd.body["id"];
        user.address.id = resultAdd.body["address_id"];
        user.address_id = resultAdd.body["address_id"];
    });

    // Na het uitvoeren van alle testen moet de gebruiker terug verwijderd worden uit de databank.
    afterAll(async () => {
        const resultDelete = await session
            .delete("/user/" + user.id)
            .set("Cookie", [cookies]);
        expect(resultDelete.status).toEqual(200);
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
            email: "new.mail@email.com",
            first_name: user.first_name,
            last_name: user.last_name,
            date_added: user.date_added,
            last_login: user.last_login,
            phone: user.phone,
            address_id: user.address_id,
            student: false,
            super_student: true,
            admin: true,
            id: user.id,
        }

        const result = await session
            .patch("/user/" + user.id)
            .send({email: updatedUser.email, super_student: true})
            .set("Cookie", [cookies]);
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(updatedUser);
    })
});
