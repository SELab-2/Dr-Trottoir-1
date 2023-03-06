import { createUser, createRegion, createUserRegion } from "./mock/user";
import { createBuilding, createAction, createGarbage, createBuildingImages } from "./mock/building";
import { createRound, createRoundBuilding } from "./mock/round";
import { createSchedule, createProgress, createProgressImage } from "./mock/schedule";

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
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
