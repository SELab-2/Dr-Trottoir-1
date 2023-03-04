import { PrismaClient } from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

export async function createRound() {
    await prisma.round.create({
        data: {
            name: chance.word()
        }
    })
}

export async function createRoundBuilding() {
    const buildings = await prisma.building.findMany();
    const rounds = await prisma.round.findMany();
    const maxBuilding = buildings.length-1;
    const maxRounds = rounds.length-1;
    const building = buildings[chance.integer({min: 0, max: maxBuilding})];
    const round = rounds[chance.integer({min: 0, max: maxRounds})];
    await prisma.roundBuilding.create({
        data: {
            round: {
                connect: {id: round.id}
            },
            building: {
                connect: {id: building.id}
            }
        }
    })
}
