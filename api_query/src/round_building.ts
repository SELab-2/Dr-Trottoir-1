import { RoundBuilding, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeBuilding } from "./include";

export type RoundBuildingQueryParameters = {
    take: number;
    skip: number;
    round_id: number;
    building_id: number;
    round: string;
    building: string;
    ivago_id: string;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type RoundBuildingAllInfo = Prisma.RoundBuildingGetPayload<{
    include: {
        round: true;
        building: typeof includeBuilding;
    };
}>;

export class RoundBuildingQuery extends Query<
    RoundBuildingQueryParameters,
    RoundBuilding,
    RoundBuildingAllInfo
> {
    endpoint = "round_building";
}
