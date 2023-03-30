import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./prisma";
import crypto from "crypto";
import { User } from "@selab-2/groep-1-orm";
import { APIError } from "./errors/api_error";
import { APIErrorCode } from "./errors/api_error_code";

export function initializePassport() {
    passport.use(
        new passportLocal.Strategy(async (email, password, cb) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email,
                },
            });

            const hash = crypto
                .createHash("sha256")
                .update(password + user.salt)
                .digest("hex");

            if (
                !crypto.timingSafeEqual(
                    Buffer.from(hash),
                    Buffer.from(user.hash),
                )
            ) {
                return cb(new APIError(APIErrorCode.FORBIDDEN), null);
            }

            const result = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email,
                },
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    last_login: true,
                    date_added: true,
                    phone: true,
                    address_id: true,
                    student: true,
                    super_student: true,
                    admin: true,
                    hash: false,
                    salt: false,
                    address: true,
                },
            });

            return cb(null, result);
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (user: User, done) => {
        done(null, user);
    });
}
