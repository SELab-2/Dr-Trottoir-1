import { Address } from "@selab-2/groep-1-orm";
import { Query } from "./query";

export class AddressQuery extends Query<void, Address, Address> {
    endpoint = "action";
}
