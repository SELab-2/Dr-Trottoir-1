import { ProgressImageType } from "@selab-2/groep-1-orm";
import { prisma } from "./prisma";

export async function initialiseSchedule() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const s1 = {
        day: timestamp,
        user_id: 1,
        round_id: 1,
    };

    const s2 = {
        day: timestamp,
        user_id: 2,
        round_id: 2,
    };

    await prisma.schedule.createMany({
        data: [s1, s2],
    });
}

export async function initialiseProgress() {
    const timestamp: Date = new Date(Date.UTC(2023, 4, 4, 12, 0, 0));

    const p1 = {
        report: "Report 1",
        arrival: timestamp,
        departure: timestamp,

        building_id: 1,
        schedule_id: 1,
    };

    const p2 = {
        report: "Report 2",
        arrival: timestamp,
        departure: timestamp,

        building_id: 2,
        schedule_id: 2,
    };

    await prisma.progress.createMany({
        data: [p1, p2],
    });
}

export async function initialiseProgressImage() {
    const pi1 = {
        type: ProgressImageType.ARRIVAL,
        description: "Description of progress image 1",
        image_id: 1,
        progress_id: 1,
    };

    const pi2 = {
        type: ProgressImageType.GARBAGE,
        description: "Description of progress image 2",
        image_id: 2,
        progress_id: 2,
    };

    await prisma.progressImage.createMany({
        data: [pi1, pi2],
    });
}
