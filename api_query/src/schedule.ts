import { Schedule } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type ScheduleQueryParameters = {
  id: number,
};

export class ScheduleQuery extends Query<ScheduleQueryParameters, Schedule> {
  endpoint = "schedule";
}
