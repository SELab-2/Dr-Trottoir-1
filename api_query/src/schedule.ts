import { Schedule, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithAddress, includeBuilding } from "./include";

export type ScheduleQueryParameters = {
    take: number;
    skip: number;
    deleted: boolean;
    before: Date;
    after: Date;
    user_id: number;
    round_id: number;
    user_name: string;
    round: string;
    sort: string[];
    ord: Array<"asc" | "desc">;
};

type ScheduleAllInfo = Prisma.ScheduleGetPayload<{
    include: {
        user: typeof includeUserWithAddress;
        round: {
            include: {
                buildings: {
                    include: {
                        building: typeof includeBuilding;
                    };
                };
            };
        };
    };
}>;

export class ScheduleQuery extends Query<
    ScheduleQueryParameters,
    Schedule,
    ScheduleAllInfo
> {
    endpoint = "schedule";
}
