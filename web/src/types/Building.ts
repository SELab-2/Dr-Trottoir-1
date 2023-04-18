import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class Building implements TableEntity<Building> {
  id: number;
  name: string;
  address: string;
  syndicus_fn: string;
  syndicus_ln: string;

  public constructor(init?: Partial<Building>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Building>> {
    return Building.headers();
  }

  static headers(): Array<Header<Building>> {
    return [
      {
        id: 2,
        name: "",
        fit: true,
        get: (e: Building) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 3,
        name: "Syndicus",
        fit: false,
        get: (e: Building) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 0,
        name: "Gebouw",
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
    ].map((e) => new Header<Building>(e));
  }

  static random(): Array<Building> {
    return [...Array(100).keys()].map(() => {
      return new Building({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        address: chance().address(),
        syndicus_fn: chance().first(),
        syndicus_ln: chance().last(),
      });
    });
  }

  route(): { name: string; params: { id: number } } {
    return {
      name: "building_id",
      params: { id: this.id },
    };
  }
}
