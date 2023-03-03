import { PrismaClient } from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

async function createUser() {
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

async function main() {
    await createUser();
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
