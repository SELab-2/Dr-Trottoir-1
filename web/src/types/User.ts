import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";

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
    ].map((e) => new Header<User>(e));
  }

  route(): { name: string; params: { id: number; isadmin: boolean } } {
    return {
      name: "account_settings",
      params: { id: this.id, isadmin: false },
    };
    // TODO: remove :isadmin when auth is in frontend
  }
}
