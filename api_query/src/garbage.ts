import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type GarbageQueryParameters = {
    take: number;
    skip: number;
    before: Date;
    after: Date;
    building_id: number;
    action_id: number;
    syndicus_id: number;
    round_id: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type GarbageAllInfo = Prisma.GarbageGetPayload<{
    include: {
        action: true;
        building: {
            select: {
                id: true;
                name: true;
                ivago_id: true;
                deleted: true;
                hash: false;
                address: true;
            };
        };
    };
}>;

export class GarbageQuery extends Query<
    GarbageQueryParameters,
    GarbageAllInfo
> {
    endpoint = "garbage";
}
