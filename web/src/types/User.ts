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
    return User.headers(this.id);
  }

  /**
   * Sort a list of Users. The object will be mutated
   * @param data The list to sort.
   * @param header_id List of header_id's to sort by, first element will be sorted first
   * @param ascending Whether to sort ascending or descending for each header_id
   * @returns The sorted list.
   */
  static sort(data: User[], header_ids: number[], header_orders: boolean[]) {

    function order(ascending: boolean): number {
      return ascending ? 1 : -1
    }

    // get the order for any 2 elements given a header id and its order
    function get_sorting(a: User, b: User, header_id: number, ascending: boolean): number{
      switch(header_id){
        case 1: // sort by name
          return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name) * order(ascending);
        case 2: // sort by if is student
          return (a.student == b.student ? 0 : a.student ? -1 : 1) * order(ascending);
        case 3: // sort by if is super student
          return (a.super_student == b.super_student ? 0 : a.super_student ? -1 : 1) * order(ascending);
        case 4: // sort by admin
          return (a.admin == b.admin ? 0 : a.admin ? -1 : 1) * order(ascending);
      }
      // should not occur
      return -1;
    }

    // sort by the header id
    data.sort((a,b) =>{
      // get the sorting order
      let order = 0;
      for(let i = 0; i < header_ids.length; i++){
        order = order || get_sorting(a,b, header_ids[i], header_orders[i]);
      }
      return order;
    })
  }

  static headers(id: number): Array<Header<User>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: User) => e.first_name + " " + e.last_name,
        type: RowType.AVATAR,
        sortable: false,
        route_to: `/account/${id}/false`,
      },
      {
        id: 1,
        name: "Naam",
        fit: false,
        get: (e: User) => e.first_name + " " + e.last_name,
        type: RowType.TEXT,
        sortable: true,
        route_to: `/account/${id}/false`,
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
        route_to: `/account/${id}/false`,
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
