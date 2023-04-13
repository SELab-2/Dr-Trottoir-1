import { Header } from "@/components/table/Header";

/**
 * Any class whose objects may be rendered as a table must conform to this
 * protocol.
 */
export abstract class TableEntity<T> {
  /**
   * The configuration objecs for this entity. See `Header.ts` for more info.
   */
  abstract headers(): Array<Header<T>>;

  /**
   * The route to follow when clicking on the row.
   */
  abstract route(): { name: string; params: object };
}
