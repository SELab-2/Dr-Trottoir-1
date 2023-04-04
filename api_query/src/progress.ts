import { Progress } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type ProgressQueryParameters = {
  id: number,
};

export class ProgressQuery extends Query<ProgressQueryParameters, Progress> {
  endpoint = "progress";
}
