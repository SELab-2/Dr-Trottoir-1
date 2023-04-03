export default interface FilterData {
  query: String;
  search_label: String;
  sort_by: String;
  sort_ascending: boolean;
  filters: string[];
  start_day: Date;
  end_day: Date;
}
