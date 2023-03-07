import { User } from "@prisma/client";

type PrismaUser = User;

export {};

declare global {
    namespace Express {
        export interface Request {
            user: PrismaUser | null;
        }

        export type User = PrismaUser
    }
}
