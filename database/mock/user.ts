import { PrismaClient } from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

export async function createUser() {
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

export async function createRegion() {
    await prisma.region.create({
        data: {
            name: chance.city()
        }
    })
}

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
