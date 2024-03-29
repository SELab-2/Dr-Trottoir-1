import { TableEntity } from "@/components/table/TableEntity";
import { Header } from "@/components/table/Header";
import { RowType } from "@/components/table/RowType";

export interface GarbageOverviewEntry {
  date: Date;
  action: string;
  time: string;
  preview: boolean;
  func: () => void;
}

export class GarbageOverviewTable extends TableEntity<GarbageOverviewEntry> {
  static headers(): Array<Header<GarbageOverviewEntry>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: GarbageOverviewEntry) => (e.preview ? "mdi-new-box" : ""),
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: () => {},
      },
      {
        id: 1,
        name: "Day",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.date.toLocaleDateString(),
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 2,
        name: "Actie",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.action,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 3,
        name: "Tijd",
        fit: false,
        get: (e: GarbageOverviewEntry) => e.time,
        type: RowType.TEXT,
        sortable: false,
      },
      {
        id: 4,
        name: "",
        fit: true,
        get: () => "mdi-close",
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: (e: GarbageOverviewEntry) => e.func(),
      },
    ].map((e) => new Header<GarbageOverviewEntry>(e));
  }

  headers(): Array<Header<GarbageOverviewEntry>> {
    return GarbageOverviewTable.headers();
  }

  route(): { name: string; params: object } {
    throw new Error("Method not implemented.");
  }
}
