import { Address } from "@selab-2/groep-1-orm";

export type SerializableUser = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    last_login: Date;
    date_added: Date;
    phone: string;
    address_id: number;
    student: boolean;
    super_student: boolean;
    admin: boolean;
    address: Address;
    syndicus: Array<{ id: number }>;
};

export {};

declare global {
    namespace Express {
        export interface Request {
            user: SerializableUser | null;
        }

        export type User = SerializableUser;
    }
}
