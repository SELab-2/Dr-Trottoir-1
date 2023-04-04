import { Syndicus } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type SyndicusQueryParameters = {
  id: number,
};

export class SyndicusQuery extends Query<SyndicusQueryParameters, Syndicus> {
  endpoint = "syndicus";
}
