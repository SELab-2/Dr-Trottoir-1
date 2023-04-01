import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";
import { formatDate } from "@/assets/scripts/format";

export class Routes implements TableEntity<Routes> {
  id: number;
  name: string;
  buildings: number;
  date: Date;
  student_fn: string;
  student_ln: string;
  finished: boolean;

  public constructor(init?: Partial<Routes>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Routes>> {
    return Routes.headers();
  }

  route_to(header_id: number): string {
    switch (header_id) {
      case 0: // route to student (click avatar)
      case 1: // route to student (click student name)
        return `/account/0/false`;
      case 2: // route to round
        return "/rondes/detail";
      default: // the other headers don't route
        return "";
    }
  }

  /**
   * Sort a list of Routes. The object will be mutated
   * @param data The list to sort.
   * @param header_id List of header_id's to sort by, first element will be sorted first
   * @param ascending Whether to sort ascending or descending for each header_id
   * @returns The sorted list.
   */
  static sort(data: Routes[], header_ids: number[], header_orders: boolean[]) {
    function order(ascending: boolean): number {
      return ascending ? 1 : -1;
    }

    // get the order for any 2 elements given a header id and its order
    function get_sorting(
      a: Routes,
      b: Routes,
      header_id: number,
      ascending: boolean,
    ): number {
      switch (header_id) {
        case 1: // sort by name
          return (
            (a.student_fn + a.student_ln).localeCompare(
              b.student_fn + b.student_ln,
            ) * order(ascending)
          );
        case 2: // sort by round
          return a.name.localeCompare(b.name) * order(ascending);
        case 3: // sort by building
          return (a.buildings - b.buildings) * order(ascending);
        case 4: // sort by date
          return (
            (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * order(ascending)
          );
        case 5: // sort by finished
          return (
            (a.finished == b.finished ? 0 : a.finished ? -1 : 1) *
            order(ascending)
          );
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

  static headers(): Array<Header<Routes>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: Routes) => e.student_fn + " " + e.student_ln,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 1,
        name: "Student",
        fit: false,
        get: (e: Routes) => e.student_fn + " " + e.student_ln,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Ronde",
        fit: false,
        get: (e: Routes) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 3,
        name: "Gebouwen",
        fit: false,
        get: (e: Routes) => e.buildings,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 4,
        name: "Datum",
        fit: false,
        get: (e: Routes) => formatDate(e.date),
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 5,
        name: "Klaar",
        fit: true,
        get: (e: Routes) => e.finished,
        type: RowType.BOOLEAN,
        sortable: true,
      },
    ];
  }

  static random(): Array<Routes> {
    return [...Array(100).keys()].map(() => {
      return new Routes({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        buildings: chance().integer({ max: 10, min: 3 }),
        date: chance().date(),
        student_fn: chance().first(),
        student_ln: chance().last(),
        finished: chance().bool(),
      });
    });
  }
}
