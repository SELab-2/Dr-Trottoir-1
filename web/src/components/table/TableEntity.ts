import { Header } from "@/components/table/Header";

/**
 * Any class whose objects may be rendered as a table must conform to this
 * protocol.
 */
export abstract class TableEntity<T> {
  abstract headers(): Array<Header<T>>;

  /**
   * Return for each header where to route to.
   * The empty string represents no routing
   * @param header_id The id of the header
   */
  abstract route_to(header_id: number): string;
}
