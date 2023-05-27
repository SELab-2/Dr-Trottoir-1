import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";

export class Building implements TableEntity<Result<BuildingQuery>> {
  headers(): Array<Header<Result<BuildingQuery>>> {
    return Building.headers();
  }

  static headers(): Array<Header<Result<BuildingQuery>>> {
    return [
      {
        id: 2,
        name: "",
        fit: true,
        get: (e: Result<BuildingQuery>) =>
          e.syndicus?.first_name + " " + e.syndicus?.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 3,
        name: "Syndicus",
        fit: false,
        get: (e: Result<BuildingQuery>) =>
          e.syndicus?.first_name + " " + e.syndicus?.last_name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 0,
        name: "Gebouw",
        fit: false,
        get: (e: Result<BuildingQuery>) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 1,
        name: "Adres",
        fit: false,
        get: (e: Result<BuildingQuery>) =>
          e.address.street + " " + e.address.number,
        type: RowType.TEXT,
        sortable: true,
      },
    ].map((e) => new Header<Result<BuildingQuery>>(e));
  }

  route(item: Result<BuildingQuery>): {
    name: string;
    params: { id: number };
  } {
    return Building.route(item);
  }

  static route(item: Result<BuildingQuery>): {
    name: string;
    params: { id: number };
  } {
    return {
      name: "building_id",
      params: { id: item.id },
    };
  }
}
