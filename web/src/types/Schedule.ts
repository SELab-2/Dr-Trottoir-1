import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { User } from "./User";

export class Schedule implements TableEntity<Schedule> {
  id: number;
  day: string;
  user: User;
  round: { name: string; buildings: [] };
  finished: boolean;

  public constructor(init?: Partial<Schedule>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<Schedule>> {
    return Schedule.headers();
  }

  static headers(): Array<Header<Schedule>> {
    return [
      {
        id: 3,
        name: "",
        fit: true,
        get: (e: Schedule) => e.user.first_name + " " + e.user.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 4,
        name: "Student",
        fit: false,
        get: (e: Schedule) => e.user.first_name + " " + e.user.last_name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 0,
        name: "Ronde",
        fit: false,
        get: (e: Schedule) => e.round.name,
        type: RowType.TEXT,
        sortable: true,
        route_to: `/rondes/detail`,
      },
      {
        id: 1,
        name: "Gebouwen",
        fit: false,
        get: (e: Schedule) => e.round.buildings.length,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Datum",
        fit: false,
        get: (e: Schedule) => e.day,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 4,
        name: "Klaar",
        fit: true,
        get: (e: Schedule) => e.finished,
        type: RowType.BOOLEAN,
        sortable: true,
      },
    ].map((e) => new Header<Schedule>(e));
  }

  route(): { name: string; params: { id: number } } {
    return {
      name: "round",
      params: { id: this.id },
    };
  }
}
