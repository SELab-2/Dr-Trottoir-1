import Address from "@/models/Address";

export default interface Building {
  name: String;
  ivagoId: String;
  syndicus: String;
  address: Address;
  manual: File;
}
