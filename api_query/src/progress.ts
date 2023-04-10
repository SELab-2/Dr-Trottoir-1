import { Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUser, selectBuilding } from "./include";

export type ProgressQueryParameters = {
    take: number;
    skip: number;
    deleted: boolean;
    report: string;
    arrived_before: Date;
    arrived_after: Date;
    left_before: Date;
    left_after: Date;
    building: number;
    schedule: number;
    round: number;
    user: number;
};

type ProgressAllInfo = Prisma.ProgressGetPayload<{
    include: {
        building: typeof selectBuilding;
        schedule: {
            include: {
                round: true;
                user: typeof includeUser;
            };
        };
        images: true;
    };
}>;

export class ProgressQuery extends Query<
    ProgressQueryParameters,
    ProgressAllInfo
> {
    endpoint = "progress";
}
