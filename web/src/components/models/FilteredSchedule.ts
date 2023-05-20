import { ScheduleQuery, ProgressQuery, Result } from "@selab-2/groep-1-query";

export default interface FilteredSchedule {
  schedule: Result<ScheduleQuery>;
  progresses: Result<ProgressQuery>[];
  roundName: string;
  roundStart: Date | null;
  roundEnd: Date | null;
  roundDate: Date;
  studentName: string;
  completedBuildings: number;
  totalBuildings: number;
  amountOfComments: number;
  roundProgress: number;
}
