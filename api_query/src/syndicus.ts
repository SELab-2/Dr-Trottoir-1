import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithAddress, includeBuilding } from "./include";

export type SyndicusQueryParameters = {
    take: number;
    skip: number;
    login_before: number;
    login_after: number;
    added_before: Date;
    added_after: Date;
    name: string;
    user: number;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type SyndicusAllInfo = Prisma.SyndicusGetPayload<{
    include: {
        user: typeof includeUserWithAddress;
        building: typeof includeBuilding;
    };
}>;

export class SyndicusQuery extends Query<
    SyndicusQueryParameters,
    SyndicusAllInfo
> {
    endpoint = "syndicus";
}
