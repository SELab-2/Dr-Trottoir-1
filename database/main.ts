import { createUser, createRegion, createUserRegion } from "./mock/user";
import { createBuilding, createGarbage, createBuildingImages } from "./mock/building";
import { createRound, createRoundBuilding } from "./mock/round";
import { createSchedule } from "./mock/schedule";

async function main() {
    //await createUser();
    //await createRegion();
    //await createBuilding();
    //await createUserRegion();
    //await createGarbage();
    //await createRound();
    await createRoundBuilding();
    await createSchedule();
    await createBuildingImages();
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
