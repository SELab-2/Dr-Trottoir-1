import { Garbage, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeBuilding } from "./include";

export type GarbageQueryParameters = {
    take: number;
    skip: number;
    before: Date;
    after: Date;
    building_id: number;
    description: string;
    syndicus_id: number;
    round_id: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type GarbageAllInfo = Prisma.GarbageGetPayload<{
    include: {
        building: typeof includeBuilding;
    };
}>;

export class GarbageQuery extends Query<
    GarbageQueryParameters,
    Garbage,
    GarbageAllInfo
> {
    endpoint = "garbage";
}
