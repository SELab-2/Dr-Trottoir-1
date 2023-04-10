import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import {selectBuilding} from "./include";

export type RoundQueryParameters = {
    take: number;
    skip: number;
    name: string;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type RoundWithBuildings = Prisma.RoundGetPayload<{
    include: {
        buildings: {
            include: {
                building: typeof selectBuilding;
            }
        }
    }
}>;

export class RoundQuery extends Query<RoundQueryParameters, RoundWithBuildings> {
    endpoint = "round";
}
