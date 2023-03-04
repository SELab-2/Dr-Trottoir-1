import { createUser, createRegion, createUserRegion } from "./mock/user";
import { createBuilding, createGarbage } from "./mock/building";
import { createRound, createRoundBuilding } from "./mock/round";

async function main() {
    //await createUser();
    //await createRegion();
    //await createBuilding();
    //await createUserRegion();
    //await createGarbage();
    //await createRound();
    await createRoundBuilding()
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
