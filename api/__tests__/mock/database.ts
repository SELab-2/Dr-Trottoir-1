import { initialiseRegion } from "./region";
import { initialiseAddress } from "./address";
import {
    initialiseSyndicus,
    initialiseUser,
    initialiseUserRegion,
} from "./user";
import { initialiseBuilding, initialiseBuildingImages } from "./building";
import {
    initialiseProgress,
    initialiseProgressImage,
    initialiseSchedule,
} from "./schedule";
import { initialiseRound, initialiseRoundBuilding } from "./round";
import { initialiseFiles } from "./file";
import { initialiseAction, initialiseGarbage } from "./garbage";
import { initialiseMailTemplate } from "./mail_template";
import { prisma } from "./prisma";
import { Prisma } from "@selab-2/groep-1-orm";

/**
 * Assuming the schema is loaded in, fills the database
 */

const initialiseFunctions: { [name: string]: () => Promise<any> } = {
    address: initialiseAddress,
    user: initialiseUser,
    files: initialiseFiles,
    region: initialiseRegion,
    user_region: initialiseUserRegion,
    syndicus: initialiseSyndicus,
    building: initialiseBuilding,
    building_image: initialiseBuildingImages,
    action: initialiseAction,
    garbage: initialiseGarbage,
    round: initialiseRound,
    round_building: initialiseRoundBuilding,
    schedule: initialiseSchedule,
    progress: initialiseProgress,
    progress_image: initialiseProgressImage,
    mail_template: initialiseMailTemplate,
};

/**
 * Initializes the database
 */
export async function initialiseDatabase(): Promise<void> {
    for (const entry in initialiseFunctions) {
        await initialiseFunctions[entry]();
    }
}

export async function restoreTables() {
    await deleteDatabaseData();
    await initialiseDatabase();
}

/**
 * Deletes all data from the database, preserving the schema
 */
export async function deleteDatabaseData() {
    const result: Array<{ table_name: string }> = await prisma.$queryRaw(
        Prisma.sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    );

    for (const entry of result) {
        const table = entry["table_name"];
        await prisma.$queryRawUnsafe(
            `TRUNCATE public.${table} RESTART IDENTITY CASCADE`,
        );
    }
}

/**
 * Resets the database. Performs a full wipe of all tables and then fills them up again
 */
export async function resetDatabase() {
    return deleteDatabaseData().then(() => initialiseDatabase());
}
