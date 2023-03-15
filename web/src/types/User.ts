import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class User implements TableEntity<User> {
  id: number;
  portrait: string;
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

  detailPageUrl(): string {
    return `/account/${this.id}/false`;
  }

  static headers(): Array<Header<User>> {
    return [
      {
        id: 0,
        name: "Portret",
        fit: true,
        get: (e: User) => e.portrait,
        type: RowType.IMAGE,
        sortable: false,
      },
      {
        id: 1,
        name: "Naam",
        fit: false,
        get: (e: User) => e.first_name + " " + e.last_name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Student",
        fit: true,
        get: (e: User) => e.student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 3,
        name: "Superstudent",
        fit: true,
        get: (e: User) => e.super_student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 4,
        name: "Admin",
        fit: true,
        get: (e: User) => e.admin,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 5,
        name: "",
        fit: true,
        get: () => "mdi-text-box-edit-outline",
        type: RowType.ICON,
        sortable: false,
      },
      {
        id: 6,
        name: "",
        fit: true,
        get: () => "mdi-trash-can-outline",
        type: RowType.ICON,
        sortable: false,
      },
    ];
  }

  static random(): Array<User> {
    return [...Array(100).keys()].map(() => {
      return new User({
        id: chance().integer(),
        portrait: `https://avatars.githubusercontent.com/u/38297449?v=4`,
        first_name: chance().first(),
        last_name: chance().last(),
        student: chance().bool(),
        super_student: chance().bool(),
        admin: chance().bool(),
      });
    });
  }
}
