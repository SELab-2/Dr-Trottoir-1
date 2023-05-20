import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { Result, RoundQuery } from "@selab-2/groep-1-query";

export class RoundTable implements TableEntity<Result<RoundQuery>> {
  headers(): Array<Header<Result<RoundQuery>>> {
    return RoundTable.headers();
  }

  static headers(): Array<Header<Result<RoundQuery>>> {
    return [
      {
        id: 3,
        name: "Naam",
        fit: false,
        get: (e: Result<RoundQuery>) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 4,
        name: "Gebouwen",
        fit: true,
        get: (e: Result<RoundQuery>) => e.buildings.length,
        type: RowType.TEXT,
        sortable: true,
      },
    ].map((e) => new Header<Result<RoundQuery>>(e));
  }

  route(item: Result<RoundQuery>): { name: string; params: { id: number } } {
    return RoundTable.route(item);
  }

  static route(item: Result<RoundQuery>): {
    name: string;
    params: { id: number };
  } {
    return {
      name: "round",
      params: { id: item.id },
    };
  }
}
