import { TableEntity } from "@/components/table/TableEntity";
import { Header } from "@/components/table/Header";
import { RowType } from "@/components/table/RowType";
import { Result, ActionQuery } from "@selab-2/groep-1-query";

export interface GarbageOverviewEntry {
  date: Date;
  action: Result<ActionQuery>;
  time: string;
  preview: boolean;
}

export class GarbageOverviewTable extends TableEntity<GarbageOverviewEntry> {
  static headers(): Array<Header<GarbageOverviewEntry>> {
    return [
      {
        id: 0,
        name: "Day",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.date.toLocaleDateString(),
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 1,
        name: "Actie",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.action.description,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 2,
        name: "Tijd",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.time,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 3,
        name: "",
        fit: true,
        get: (e: GarbageOverviewEntry) => (e.preview ? "mdi-new-box" : ""),
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: () => {},
      },
    ].map((e) => new Header<GarbageOverviewEntry>(e));
  }

  headers(): Array<Header<GarbageOverviewEntry>> {
    return GarbageTable.headers();
  }

  route(): { name: string; params: object } {
    throw new Error("Method not implemented.");
  }
}
