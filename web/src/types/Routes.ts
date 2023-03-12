import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class Routes implements TableEntity<Routes> {
  id: number;
  name: string;
  buildings: number;

  public constructor(init?: Partial<Routes>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Routes>> {
    return Routes.headers();
  }

  static headers(): Array<Header<Routes>> {
    return [
      {
        id: 0,
        name: "Naam",
        fit: false,
        get: (e: Routes) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 1,
        name: "Gebouwen",
        fit: false,
        get: (e: Routes) => e.buildings,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 5,
        name: "",
        fit: true,
        get: () => "mdi-text-box-edit-outline",
        type: RowType.ICON,
        sortable: false,
      },
      {
        id: 6,
        name: "",
        fit: true,
        get: () => "mdi-trash-can-outline",
        type: RowType.ICON,
        sortable: false,
      },
    ];
  }

  static random(): Array<Routes> {
    return [...Array(100).keys()].map(() => {
      return new Routes({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        buildings: chance().integer({ max: 10, min: 3 }),
      });
    });
  }
}
