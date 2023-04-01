import { RowType } from "@/components/table/RowType";

/**
 * Models a column in a table for a generic type T.
 */
export abstract class Header<T> {
  // A unique integer
  id: number;

  // The shown name of the column
  name: string;

  // A function which retrieves the value for this column of a given entry
  get: (element: T) => any;

  // Indicate how to render the value
  type: RowType;

  // Whether the width of the column should fit to the contents
  fit: boolean = false;

  // Whether this column can be sorted
  sortable: boolean = false;

  // The route to link to
  // if the empty string is given, it will not route
  route_to: string;
}
