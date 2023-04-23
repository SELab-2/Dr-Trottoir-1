import { RowType } from "@/components/table/RowType";

/**
 * Models a column in a table for a generic type T.
 */
export class Header<T> {
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

  // Whether the values in the list are sorted using this header.
  order: "asc" | "desc" | null = null;

  // Partial constructor
  constructor(init?: Partial<Header<T>>) {
    Object.assign(this, init);
  }

  // Action to perform when clicked on.
  onClick: (e: T, list: Array<T | null>) => void = () => {};

  // TODO: replace with API call.
  // Sorts an array of T's using this specific field.
  sort(elements: Array<T>) {
    let flip = 1;

    if (this.order == "asc") {
      this.order = "desc";
      flip = -1;
    } else {
      this.order = "asc";
    }

    elements.sort((a: T, b: T) => {
      return (this.get(b) > this.get(a) ? -1 : 1) * flip;
    });
  }
}
