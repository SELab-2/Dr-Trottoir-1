export default interface Filterdata {
  query: string;
  search_label: string;
  sort_by: string;
  sort_ascending: boolean;
  filters: string[];
  start_day: Date;
  end_day: Date;
}
