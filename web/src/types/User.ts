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

  route_to(header_id: number): string {
    switch (header_id) {
      case 0: // route to student (click avatar)
      case 1: // route to student (click student name)
      case 5: // route to student (click edit account icon)
        return `/account/${this.id}/false`;
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
  static sort(data: User[], header_ids: number[], header_orders: boolean[]) {
    // TODO: sorted API call
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
      {
        id: 5,
        name: "",
        fit: true,
        get: () => "mdi-account-cog-outline",
        type: RowType.ICONBUTTON,
        sortable: false,
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
