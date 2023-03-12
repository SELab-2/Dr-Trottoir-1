import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./prisma";
import { pbkdf2Async } from "./crypto";
import crypto from "crypto";
import { User } from "@prisma/client";

// TODO: these constants are very very dangerous!
const CRYPTO_EXAMPLE_PASSWORD = "password";
const CRYPTO_SALT_UNSAFE = "salt_unsafe";

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
                CRYPTO_SALT_UNSAFE,
                CRYPTO_ITERATIONS,
                CRYPTO_KEY_LENGTH,
                CRYPTO_DIGEST,
            );

            const target = await pbkdf2Async(
                CRYPTO_EXAMPLE_PASSWORD,
                CRYPTO_SALT_UNSAFE,
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
