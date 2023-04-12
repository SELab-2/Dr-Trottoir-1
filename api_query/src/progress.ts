import { Progress, Prisma } from "@selab-2/groep-1-orm";
import { Query } from "./query";
import { includeUserWithoutAddress, includeBuilding } from "./include";

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
        building: typeof includeBuilding;
        schedule: {
            include: {
                round: true;
                user: typeof includeUserWithoutAddress;
            };
        };
        images: true;
    };
}>;

export class ProgressQuery extends Query<
    ProgressQueryParameters,
    ProgressAllInfo,
    Progress
> {
    endpoint = "progress";
}
