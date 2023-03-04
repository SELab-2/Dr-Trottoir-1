import { createUser, createRegion, createUserRegion } from "./mock/user";
import { createBuilding } from "./mock/building";

async function main() {
    //await createUser();
    await createRegion();
    //await createBuilding();
    //await createUserRegion();
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
