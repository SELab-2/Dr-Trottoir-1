import app from "../../src/main";
import request from "supertest"
const session = require("supertest-session")


describe("Test", () => {
    test("Sanity check", () => {
        expect(2+2).toBe(4);
    })
})

let ses;
beforeEach(async () => {
    ses = await session(app)
})

describe("App test", () => {
    let authSession;

    beforeEach((done) => {
        ses.post("/auth/login")
            .send({username: "jens.pots@ugent.be", password: "password"})
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                authSession = ses;
                return done();
            })
    })

    test("Print app", async () => {
        authSession.get("/building")
            .expect(200)
    })
})
