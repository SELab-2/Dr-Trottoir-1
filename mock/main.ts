import {
    createUser,
    createRegion,
    createUserRegion,
    addDefaultAdministrator,
} from "./src/user";
import {
    createBuilding,
    createAction,
    createGarbage,
    createBuildingImages,
} from "./src/building";
import { createRound, createRoundBuilding } from "./src/round";
import {
    createSchedule,
    createProgress,
    createProgressImage,
} from "./src/schedule";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    await createUser();
    await createRegion();
    await createBuilding();
    await createUserRegion();
    await createAction();
    await createGarbage();
    await createRound();
    await createRoundBuilding();
    await createSchedule();
    await createBuildingImages();
    await createProgress();
    await createProgressImage();
    await addDefaultAdministrator();
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
