import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class Routes implements TableEntity<Routes> {
  id: number;
  name: string;
  buildings: number;
  date: string;
  student_fn: string;
  student_ln: string;
  finished: boolean;

  public constructor(init?: Partial<Routes>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Routes>> {
    return Routes.headers();
  }

  static headers(): Array<Header<Routes>> {
    return [
      {
        id: 3,
        name: "",
        fit: true,
        get: (e: Routes) => e.student_fn + " " + e.student_ln,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 4,
        name: "Student",
        fit: false,
        get: (e: Routes) => e.student_fn + " " + e.student_ln,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 0,
        name: "Ronde",
        fit: false,
        get: (e: Routes) => e.name,
        type: RowType.TEXT,
        sortable: true,
        route_to: `/rondes/detail`,
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
        id: 2,
        name: "Datum",
        fit: false,
        get: (e: Routes) => e.date,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 4,
        name: "Klaar",
        fit: true,
        get: (e: Routes) => e.finished,
        type: RowType.BOOLEAN,
        sortable: true,
      },
    ].map((e) => new Header<Routes>(e));
  }

  static random(): Array<Routes> {
    return [...Array(100).keys()].map(() => {
      return new Routes({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        buildings: chance().integer({ max: 10, min: 3 }),
        date: String(chance().date({ string: true, american: false })),
        student_fn: chance().first(),
        student_ln: chance().last(),
        finished: chance().bool(),
      });
    });
  }

  route(): { name: string; params: { id: number } } {
    return {
      name: "round",
      params: { id: this.id },
    };
  }
}
