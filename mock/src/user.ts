import { PrismaClient } from '@selab-2/groep-1-orm'
import { Chance } from "chance";
import crypto from "crypto";

const prisma = new PrismaClient()
const chance = new Chance();

/*
Bij het toevoegen van een nieuwe gebruiker aan de databank wordt ook een nieuw adres aangemaakt. Een nieuw adres kan
enkel via deze functie of via de functie createBuilding in de databank geplaatst worden, dus niet via een aparte functie.
 */
export async function createUser() {
    const password = "password";
    const salt = crypto.randomBytes(32).toString();
    await prisma.user.create({
        data: {
            first_name: chance.first(),
            last_name: chance.last(),
            phone: chance.phone(),
            admin: chance.bool(),
            super_student: chance.bool(),
            student: chance.bool(),
            last_login: chance.date(),
            date_added: chance.date(),
            email: chance.email(),
            salt: salt,
            hash: crypto.createHash('sha256').update(password+salt).digest('hex'),
            address: {
                create: {
                    city: "Gent",
                    street: chance.street(),
                    number: chance.integer({min: 1, max: 200}),
                    zip_code: chance.integer({min: 1000, max: 9999}),
                    latitude: chance.latitude(),
                    longitude: chance.longitude(),
                }
            }
        }
    })
}

export async function createRegion() {
    await prisma.region.create({
        data: {
            name: chance.city()
        }
    })
}

/*
Om een gebruiker te koppelen aan een regio worden willekeurig bestaande waarden genomen uit de tabellen "user" en "region".
 */
export async function createUserRegion() {
    const users = await prisma.user.findMany();
    const regions = await prisma.region.findMany();
    const numUsers = users.length;
    const numRegions = regions.length;
    const user = users[chance.integer({min: 0, max: numUsers-1})];
    const region = regions[chance.integer({min: 0, max: numRegions-1})];
    await prisma.userRegion.create({
        data: {
            user: {
                connect: {id: user.id}
            },
            region: {
                connect: {id: region.id}
            }
        }
    })
}
