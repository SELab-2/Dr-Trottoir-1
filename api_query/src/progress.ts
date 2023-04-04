import { Progress } from "@selab-2/groep-1-orm";
import { Query } from "./query";

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

export class ProgressQuery extends Query<ProgressQueryParameters, Progress> {
    endpoint = "progress";
}
