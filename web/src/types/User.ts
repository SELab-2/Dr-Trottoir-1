import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { Result, UserQuery } from "@selab-2/groep-1-query";

export class User implements TableEntity<Result<UserQuery>> {
  headers(): Array<Header<Result<UserQuery>>> {
    return User.headers();
  }

  static headers(): Array<Header<Result<UserQuery>>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: Result<UserQuery>) => e.first_name + " " + e.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 1,
        name: "Naam",
        fit: false,
        get: (e: Result<UserQuery>) => e.first_name + " " + e.last_name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Student",
        fit: true,
        get: (e: Result<UserQuery>) => e.student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 3,
        name: "Superstudent",
        fit: true,
        get: (e: Result<UserQuery>) => e.super_student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 4,
        name: "Admin",
        fit: true,
        get: (e: Result<UserQuery>) => e.admin,
        type: RowType.BOOLEAN,
        sortable: true,
      },
    ].map((e) => new Header<Result<UserQuery>>(e));
  }

  route(item: Result<UserQuery>): { name: string; params: { id: number } } {
    return User.route(item);
  }

  static route(item: Result<UserQuery>): {
    name: string;
    params: { id: number };
  } {
    return {
      name: "account_settings",
      params: { id: item.id },
    };
  }
}
