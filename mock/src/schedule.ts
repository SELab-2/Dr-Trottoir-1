import { PrismaClient, ProgressImageType } from '@selab-2/groep-1-orm'
import { Chance } from "chance";

const prisma = new PrismaClient()
const chance = new Chance();

/*
Bij het maken van een planning wordt een gebruiker gekoppeld aan een ronde op een specifieke dag.
Deze dag krijgt een willekeurige waarde, maar de gebruiker en ronde worden (ook willekeurig) genomen uit de tabellen.
 */
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

/*
Hier worden de planning en het gebouw willekeurig gekozen uit de tabel met reeds bestaande waarden, maar het verslag
(report) en de tijden van aankomst en vertrek worden telkens nieuw gegenereerd. Hierdoor zullen de tijden van aankomst
en vertrek echter niet goed overeenstemmen.
 */
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

/*
Voor de tabel waarin afbeeldingen gelinkt worden aan de vooruitgang (progress) van een gebruiker in een ronde
wordt telkens een nieuwe afbeelding gegenereerd. Dit is, samen met de functie createBuildingImage, de enige manier
om een nieuwe afbeelding aan de databank toe te voegen.
 */
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
