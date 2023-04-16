export function date_to_hh_mm(date: Date | null): string {
  if (!date) {
    return "";
  }
  return date.toLocaleTimeString("nl", { hour: "2-digit", minute: "2-digit" });
}
