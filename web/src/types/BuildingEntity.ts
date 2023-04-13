import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import chance from "chance";

export class BuildingEntity implements TableEntity<BuildingEntity> {
  id: number;
  name: string;
  address: string;
  syndicus_fn: string;
  syndicus_ln: string;

  public constructor(init?: Partial<BuildingEntity>) {
    Object.assign(this, init);
  }

  headers(): Array<Header<BuildingEntity>> {
    return BuildingEntity.headers();
  }

  static headers(): Array<Header<BuildingEntity>> {
    return [
      {
        id: 2,
        name: "",
        fit: true,
        get: (e: BuildingEntity) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.AVATAR,
        sortable: false,
      },
      {
        id: 3,
        name: "Syndicus",
        fit: false,
        get: (e: BuildingEntity) => e.syndicus_fn + " " + e.syndicus_ln,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 0,
        name: "Gebouw",
        fit: false,
        get: (e: BuildingEntity) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
      {
        id: 1,
        name: "Adres",
        fit: false,
        get: (e: BuildingEntity) => e.address,
        type: RowType.TEXT,
        sortable: true,
      },
    ].map((e) => new Header<BuildingEntity>(e));
  }

  static random(): Array<BuildingEntity> {
    return [...Array(100).keys()].map(() => {
      return new BuildingEntity({
        id: chance().integer(),
        name: chance().sentence({ words: 4 }),
        address: chance().address(),
        syndicus_fn: chance().first(),
        syndicus_ln: chance().last(),
      });
    });
  }

  route(): string {
    return `/gebouw/${this.id}`;
  }
}
