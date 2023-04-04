import { Round } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type RoundQueryParameters = {
  id: number,
};

export class RoundQuery extends Query<RoundQueryParameters, Round> {
  endpoint = "round";
}
