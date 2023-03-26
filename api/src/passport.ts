import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./prisma";
import { pbkdf2Async } from "./crypto";
import crypto from "crypto";
import { User } from "@selab-2/groep-1-orm";

const CRYPTO_ITERATIONS = 310000;
const CRYPTO_KEY_LENGTH = 32;
const CRYPTO_DIGEST = "sha256";

export function initializePassport() {
    passport.use(
        new passportLocal.Strategy(async (email, password, cb) => {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: email,
                },
            });

            const hash = await pbkdf2Async(
                password,
                user.salt,
                CRYPTO_ITERATIONS,
                CRYPTO_KEY_LENGTH,
                CRYPTO_DIGEST,
            );

            const target = await pbkdf2Async(
                password,
                user.salt,
                CRYPTO_ITERATIONS,
                CRYPTO_KEY_LENGTH,
                CRYPTO_DIGEST,
            );

            if (!crypto.timingSafeEqual(hash, target)) {
                return cb(null, false);
            }

            return cb(null, user);
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (user: User, done) => {
        done(null, user);
    });
}
