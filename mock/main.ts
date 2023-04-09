import dotenv from "dotenv";
import { deleteDatabaseData, initialiseDatabase } from "./src/database";

dotenv.config();

async function main() {
    console.log("Purging existing data");
    await deleteDatabaseData();
    console.log("Loading new data");
    await initialiseDatabase();
}

// Actually call main
main().then(() => console.log("Mock data generation finished."));
