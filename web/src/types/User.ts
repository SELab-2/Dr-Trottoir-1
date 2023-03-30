import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class User implements TableEntity<User> {
  id: number;
  first_name: string;
  last_name: string;
  student: boolean;
  super_student: boolean;
  admin: boolean;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<User>> {
    return User.headers();
  }

  static headers(): Array<Header<User>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: User) => e.first_name + " " + e.last_name,
        type: RowType.AVATAR,
        sortable: false,
        route_to: `/account/${this.id}/false`,
      },
      {
        id: 1,
        name: "Naam",
        fit: false,
        get: (e: User) => e.first_name + " " + e.last_name,
        type: RowType.TEXT,
        sortable: true,
        route_to: `/account/${this.id}/false`,
      },
      {
        id: 2,
        name: "Student",
        fit: true,
        get: (e: User) => e.student,
        type: RowType.BOOLEAN,
        sortable: true,
        route_to: "",
      },
      {
        id: 3,
        name: "Superstudent",
        fit: true,
        get: (e: User) => e.super_student,
        type: RowType.BOOLEAN,
        sortable: true,
        route_to: "",
      },
      {
        id: 4,
        name: "Admin",
        fit: true,
        get: (e: User) => e.admin,
        type: RowType.BOOLEAN,
        sortable: true,
        route_to: "",
      },
      {
        id: 5,
        name: "",
        fit: true,
        get: () => "mdi-account-cog-outline",
        type: RowType.ICONBUTTON,
        sortable: false,
        route_to: `/account/${this.id}/false`,
      },
    ];
  }

  static random(): Array<User> {
    return [...Array(100).keys()].map(() => {
      return new User({
        id: chance().integer(),
        first_name: chance().first(),
        last_name: chance().last(),
        student: chance().bool(),
        super_student: chance().bool(),
        admin: chance().bool(),
      });
    });
  }
}
