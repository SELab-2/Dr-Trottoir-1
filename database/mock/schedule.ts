import {PrismaClient, ProgressImageType} from '@prisma/client'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

export async function createSchedule() {
    const rounds = await prisma.round.findMany();
    const users = await prisma.user.findMany();
    const maxRound = rounds.length - 1;
    const maxUser = users.length - 1;
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

export async function createProgress() {
    const schedules = await prisma.schedule.findMany();
    const buildings = await prisma.building.findMany();
    const maxSchedule = schedules.length - 1;
    const maxBuilding = buildings.length - 1;
    const schedule = schedules[chance.integer({min: 0, max: maxSchedule})];
    const building = buildings[chance.integer({min: 0, max: maxBuilding})];
    await prisma.progress.create({
        data: {
            report: chance.sentence(),
            arrival: chance.date(),
            departure: chance.date(),
            schedule: {
                connect: {id: schedule.id}
            },
            building: {
                connect: {id: building.id}
            }
        }
    })
}

export async function createProgressImage() {
    const progresses = await prisma.progress.findMany();
    const types : ProgressImageType[] = ['ARRIVAL', 'DEPARTURE', 'GARBAGE'];
    const maxProgress = progresses.length - 1;
    const progress = progresses[chance.integer({min: 0, max: maxProgress})];
    const type = types[chance.integer({min: 0, max: 2})];
    await prisma.progressImage.create({
        data: {
            type: type,
            description: chance.sentence(),
            progress: {
                connect: {id: progress.id}
            },
            image: {
                create: {
                    time: chance.date()
                }
            }
        }
    })
}
