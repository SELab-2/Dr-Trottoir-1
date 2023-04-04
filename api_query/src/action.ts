import { Action } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type ActionQueryParameters = {
  id: number,
};

export class ActionQuery extends Query<ActionQueryParameters, Action> {
  endpoint = "action";
}
