import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class Building implements TableEntity<Building> {
  id: number;
  name: string;
  address: { street: string, number: number };
  syndicus : { user: { first_name: string, last_name: string } }

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
        get: (e: Building) => e.syndicus.user.first_name + " " + e.syndicus.user.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 3,
        name: "Syndicus",
        fit: false,
        get: (e: Building) => e.syndicus.user.first_name + " " + e.syndicus.user.last_name,
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
        get: (e: Building) => e.address.street + " " + e.address.number,
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
        // address: chance().address(),
        // syndicus_fn: chance().first(),
        // syndicus_ln: chance().last(),
      });
    });
  }

  route(): string {
    return `/gebouw/${this.id}`;
  }
}
