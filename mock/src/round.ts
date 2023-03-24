import { PrismaClient } from '@selab-2/groep-1-orm'
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

/*
Bij het koppelen van een gebouw aan een ronde worden bestaande gebouwen en rondes gebruikt. Deze worden willekeurig
gekozen uit de tabellen.
 */
export async function createRoundBuilding() {
    const buildings = await prisma.building.findMany();
    const rounds = await prisma.round.findMany();
    const maxBuilding = buildings.length - 1;
    const maxRound = rounds.length - 1;
    const building = buildings[chance.integer({min: 0, max: maxBuilding})];
    const round = rounds[chance.integer({min: 0, max: maxRound})];
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
