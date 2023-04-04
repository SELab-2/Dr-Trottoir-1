import { Building } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export type BuildingQueryParameters = {
  id: number,
};

export class BuildingQuery extends Query<BuildingQueryParameters, Building> {
  endpoint = "building";
}
