import { Header } from "@/components/table/Header";

/**
 * Any class whose objects may be rendered as a table must conform to this
 * protocol.
 */
export abstract class TableEntity<T> {
  abstract headers(): Array<Header<T>>;
}
