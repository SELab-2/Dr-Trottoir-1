import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class UserEntity implements TableEntity<UserEntity> {
  id: number;
  first_name: string;
  last_name: string;
  student: boolean;
  super_student: boolean;
  admin: boolean;

  public constructor(init?: Partial<UserEntity>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<UserEntity>> {
    return UserEntity.headers();
  }

  static headers(): Array<Header<UserEntity>> {
    return [
      {
        id: 0,
        name: "",
        fit: true,
        get: (e: UserEntity) => e.first_name + " " + e.last_name,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 1,
        name: "Naam",
        fit: false,
        get: (e: UserEntity) => e.first_name + " " + e.last_name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 2,
        name: "Student",
        fit: true,
        get: (e: UserEntity) => e.student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 3,
        name: "Superstudent",
        fit: true,
        get: (e: UserEntity) => e.super_student,
        type: RowType.BOOLEAN,
        sortable: true,
      },
      {
        id: 4,
        name: "Admin",
        fit: true,
        get: (e: UserEntity) => e.admin,
        type: RowType.BOOLEAN,
        sortable: true,
      },
    ].map((e) => new Header<UserEntity>(e));
  }

  static random(): Array<UserEntity> {
    return [...Array(100).keys()].map(() => {
      return new UserEntity({
        id: chance().integer(),
        first_name: chance().first(),
        last_name: chance().last(),
        student: chance().bool(),
        super_student: chance().bool(),
        admin: chance().bool(),
      });
    });
  }

  route(): { name: string; params: { id: number } } {
    return {
      name: "account_settings",
      params: { id: this.id },
    };
  }
}