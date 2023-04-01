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

  static sort() {
    //API call
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
