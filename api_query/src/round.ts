import { Round, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeBuilding } from "./include";

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
                building: typeof includeBuilding;
            };
        };
    };
}>;

export class RoundQuery extends Query<
    RoundQueryParameters,
    RoundWithBuildings,
    Round
> {
    endpoint = "round";
}
