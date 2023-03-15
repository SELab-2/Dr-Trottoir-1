import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class Building implements TableEntity<Building> {
  id: number;
  name: string;
  address: string;

  public constructor(init?: Partial<Building>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Building>> {
    return Building.headers();
  }

  detailPageUrl(): string {
    return `/dashboard/gebouwen/${this.id}`;
  }

  static headers(): Array<Header<Building>> {
    return [
      {
        id: 0,
        name: "Naam",
        fit: false,
        get: (e: Building) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 1,
        name: "Adres",
        fit: false,
        get: (e: Building) => e.address,
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

  static random(): Array<Building> {
    return [...Array(100).keys()].map(() => {
      return new Building({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        address: chance().address(),
      });
    });
  }
}
