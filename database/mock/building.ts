import { PrismaClient } from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

export async function createBuilding() {
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
                    }
                }
            },
            address: {
                create: {
                    city: "Gent",
                    street: chance.street(),
                    number: chance.integer({min: 1, max: 200}),
                    zip_code: chance.integer({min: 1000, max: 9999}),
                    latitude: chance.latitude(),
                    longitude: chance.longitude(),
                }
            },
            manual: {
                create: {
                    path: chance.word()+'/'+chance.word()+'/'+chance.word()
                }
            }
        }
    })
}

export async function createGarbage() {
    const buildings = await prisma.building.findMany();
    const maxBuilding = buildings.length-1;
    const building = buildings[chance.integer({min: 0, max: maxBuilding})];
    await prisma.garbage.create({
        data: {
            pickup_time: chance.date(),
            building: {
                connect: {id: building.id}
            },
            action: {
                create: {
                    description: chance.sentence()
                }
            }
        }
    })
}
