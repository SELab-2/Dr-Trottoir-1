import { PrismaClient } from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

export async function createSchedule() {
    const rounds = await prisma.round.findMany();
    const users = await prisma.user.findMany();
    const maxRound = rounds.length-1;
    const maxUser = users.length-1;
    const round = rounds[chance.integer({min: 0, max: maxRound})];
    const user = users[chance.integer({min: 0, max:maxUser})];
    await prisma.schedule.create({
        data: {
            day: chance.date(),
            round: {
                connect: {id: round.id}
            },
            user: {
                connect: {id: user.id}
            }
        }
    })
}
