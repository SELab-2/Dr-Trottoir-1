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

  route_to(header_id: number): string {
    switch (header_id) {
      case 0: // route to syndicus (click avatar)
      case 1: // route to syndicus (click syndicus name)
        return "/account/0/false";
      case 2: // route to building (click building name)
      case 3: // route to building (click building adress)
        return `/gebouw/${this.id}`;
      default: // the other headers don't route
        return "";
    }
  }

  static sort() {
    //API call
  }

  static headers(): Array<Header<Building>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: Building) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 1,
        name: "Syndicus",
        fit: false,
        get: (e: Building) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Gebouw",
        fit: false,
        get: (e: Building) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 3,
        name: "Adres",
        fit: false,
        get: (e: Building) => e.address,
        type: RowType.TEXT,
        sortable: true,
      },
    ];
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
}
