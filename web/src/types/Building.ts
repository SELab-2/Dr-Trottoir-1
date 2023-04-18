import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { User } from "./User";

export class Building implements TableEntity<Building> {
  id: number;
  name: string;
  address: { street: string; number: number };
  syndicus: { user: User };

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
        get: (e: Building) =>
          e.syndicus.user.first_name + " " + e.syndicus.user.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 3,
        name: "Syndicus",
        fit: false,
        get: (e: Building) =>
          e.syndicus.user.first_name + " " + e.syndicus.user.last_name,
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

  route(): { name: string; params: { id: number } } {
    return {
      name: "building_id",
      params: { id: this.id },
    };
  }
}
