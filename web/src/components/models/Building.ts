import Address2 from "@/components/models/Address2";

export default interface Building {
  name: String;
  ivagoId: String;
  syndicus: String;
  address: Address2;
  manual: File | null;
}
