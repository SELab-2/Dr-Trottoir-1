import { TableEntity } from "@/components/table/TableEntity";
import { Header } from "@/components/table/Header";
import { RowType } from "@/components/table/RowType";

export interface DetailedDay {
  date: Date;
  action: string;
  time: string;
}

export class GarbageTable extends TableEntity<DetailedDay> {
  static headers(): Array<Header<DetailedDay>> {
    return [
      {
        id: 0,
        name: "Day",
        fit: false,
        get: (e: DetailedDay) => e.date.toLocaleDateString(),
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 1,
        name: "Actie",
        fit: false,
        get: (e: DetailedDay) => e.action,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 2,
        name: "Tijd",
        fit: false,
        get: (e: DetailedDay) => e.time,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 3,
        name: "",
        fit: true,
        get: () => "mdi-close",
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: (e: DetailedDay, list: Array<DetailedDay | null>) => {
          const index = list.findIndex((x) => x === e);
          list[index] = null;
        },
      },
    ].map((e) => new Header<DetailedDay>(e));
  }

  headers(): Array<Header<DetailedDay>> {
    return GarbageTable.headers();
  }

  route(): { name: string; params: object } {
    throw new Error("Method not implemented.");
  }
}
