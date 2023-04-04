import { Garbage } from "@selab-2/groep-1-orm";
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

export class GarbageQuery extends Query<GarbageQueryParameters, Garbage> {
    endpoint = "garbage";
}
