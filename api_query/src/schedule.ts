import { Schedule } from "@selab-2/groep-1-orm";
import { Query } from "./query";

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

export class ScheduleQuery extends Query<ScheduleQueryParameters, Schedule> {
    endpoint = "schedule";
}
