import { Region } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type RegionQueryParameters = {
  id: number,
};

export class RegionQuery extends Query<RegionQueryParameters, Region> {
  endpoint = "region";
}
