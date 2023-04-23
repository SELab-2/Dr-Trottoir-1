import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./prisma";
import crypto from "crypto";
import { APIError } from "./errors/api_error";
import { APIErrorCode } from "./errors/api_error_code";
import { SerializableUser } from "./types";

export function initializePassport() {
    passport.use(
        new passportLocal.Strategy(async (email, password, cb) => {
            const user = await prisma.user.findFirst({
                where: {
                    email: email,
                    deleted: false,
                },
            });
            if (user === null) {
                return cb(null, undefined);
            }

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
                return cb(new APIError(APIErrorCode.FORBIDDEN), undefined);
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
                    syndicus: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            return cb(null, result);
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (user: SerializableUser, done) => {
        done(null, user);
    });
}
