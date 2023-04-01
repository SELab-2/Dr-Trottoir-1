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

  /**
   * Sort a list of Users. The object will be mutated
   * @param data The list to sort.
   * @param header_id List of header_id's to sort by, first element will be sorted first
   * @param ascending Whether to sort ascending or descending for each header_id
   * @returns The sorted list.
   */
  static sort(
    data: Building[],
    header_ids: number[],
    header_orders: boolean[],
  ) {
    function order(ascending: boolean): number {
      return ascending ? 1 : -1;
    }

    // get the order for any 2 elements given a header id and its order
    function get_sorting(
      a: Building,
      b: Building,
      header_id: number,
      ascending: boolean,
    ): number {
      switch (header_id) {
        case 1: // sort by syndicus name
          return (
            (a.syndicus_fn + a.syndicus_ln).localeCompare(
              b.syndicus_fn + b.syndicus_ln,
            ) * order(ascending)
          );
        case 2: // sort by building name
          return a.name.localeCompare(b.name) * order(ascending);
        case 3: // sort by address
          return a.address.localeCompare(b.address) * order(ascending);
      }
      // should not occur
      return -1;
    }

    // sort by the header id
    data.sort((a, b) => {
      // get the sorting order
      let order = 0;
      for (let i = 0; i < header_ids.length; i++) {
        order = order || get_sorting(a, b, header_ids[i], header_orders[i]);
      }
      return order;
    });
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
