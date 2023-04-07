import { PrismaClient } from "@selab-2/groep-1-orm";
import { Chance } from "chance";
import crypto from "crypto";

const prisma = new PrismaClient();
const chance = new Chance();

/*
Bij het aanmaken van een nieuw gebouw worden ook nieuwe waarden toegevoegd aan de databank in de tabellen van
syndicus, adres en bestand. Deze tabellen kunnen enkel via deze functie gevuld worden en dus niet via een aparte
create-functie. De tabel van adres kan echter wel nog aangevuld worden via de functie createUser in het bestand user.ts.
 */
export async function createBuilding() {
    const password = "password";
    const salt = crypto.randomBytes(32).toString("hex");
    await prisma.building.create({
        data: {
            name: chance.company(),
            ivago_id: chance.guid(),
            syndicus: {
                create: {
                    user: {
                        create: {
                            first_name: chance.first(),
                            last_name: chance.last(),
                            phone: chance.phone(),
                            admin: false,
                            super_student: false,
                            student: false,
                            last_login: chance.date(),
                            date_added: chance.date(),
                            email: chance.email(),
                            salt: salt,
                            hash: crypto
                                .createHash("sha256")
                                .update(password + salt)
                                .digest("hex"),
                            address: {
                                create: {
                                    city: "Gent",
                                    street: chance.street(),
                                    number: chance.integer({
                                        min: 1,
                                        max: 200,
                                    }),
                                    zip_code: chance.integer({
                                        min: 1000,
                                        max: 9999,
                                    }),
                                    latitude: chance.latitude(),
                                    longitude: chance.longitude(),
                                },
                            },
                        },
                    },
                },
            },
            address: {
                create: {
                    city: "Gent",
                    street: chance.street(),
                    number: chance.integer({ min: 1, max: 200 }),
                    zip_code: chance.integer({ min: 1000, max: 9999 }),
                    latitude: chance.latitude(),
                    longitude: chance.longitude(),
                },
            },
            manual: {
                create: {
                    path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    location: "EXTERNAL",
                },
            },
        },
    });
}

export async function createAction() {
    await prisma.action.create({
        data: {
            description: chance.sentence(),
        },
    });
}

/*
Deze functie maakt nieuwe data aan voor de tabel "garbage". Hiervoor neemt het willekeurig een bestaand gebouw
uit de tabel "building" en een bestaande actie uit de tabel "action".
 */
export async function createGarbage() {
    const buildings = await prisma.building.findMany();
    const actions = await prisma.action.findMany();
    const maxBuilding = buildings.length - 1;
    const maxAction = actions.length - 1;
    const building = buildings[chance.integer({ min: 0, max: maxBuilding })];
    const action = actions[chance.integer({ min: 0, max: maxAction })];
    await prisma.garbage.create({
        data: {
            pickup_time: chance.date(),
            building: {
                connect: { id: building.id },
            },
            action: {
                connect: { id: action.id },
            },
        },
    });
}

/*
Om een waarde toe te voegen aan de tabel "buildingImage" wordt een bestaand gebouw gebruikt (willekeurig gekozen)
en wordt een nieuwe afbeelding aangemaakt. Een afbeelding kan niet via een aparte create-functie gemaakt worden.
 */
export async function createBuildingImages() {
    const buildings = await prisma.building.findMany();
    const maxBuilding = buildings.length - 1;
    const building = buildings[chance.integer({ min: 0, max: maxBuilding })];
    await prisma.buildingImages.create({
        data: {
            building: {
                connect: { id: building.id },
            },
            image: {
                create: {
                    time: chance.date(),
                    path: "https://unsplash.com/photos/2ONGY4I82lg/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgwMzYyNjc3&force=true&w=640",
                    location: "EXTERNAL",
                },
            },
        },
    });
}
