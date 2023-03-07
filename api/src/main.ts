import express from "express";
import { UserRouting } from "./routes/user";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { BuildingRouting } from "./routes/building";
import "express-async-errors";
import { ErrorHandler } from "./errors/error_handler";
import { Auth } from "./auth/auth";
import { ScheduleRouting } from "./routes/schedule";
import { AuthRouting } from "./routes/auth";
import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./prisma";
import crypto from "crypto";
import { pbkdf2Async } from "./crypto";
import session from "express-session";

const PORT_NUMBER = 8080;
const CRYPTO_EXAMPLE_PASSWORD = "password";
const CRYPTO_SALT_UNSAFE = "salt_unsafe";

const CRYPTO_ITERATIONS = 310000;
const CRYPTO_KEY_LENGTH = 32;
const CRYPTO_DIGEST = 'sha256';
const CRYPTO_SESSION_TOKEN = "verysecrettoken";

const app = express();

// JSON API support
app.use(
    express.json({
        inflate: true,
        strict: true,
        type: "application/json",
    }),
);

// Helmet adds many headers for more secure connections
app.use(helmet());

// Morgan logs and prints all incoming requests
app.use(morgan("dev"));

// Compress responses
app.use(compression());

// Session support
app.use(session({
    genid: function(req) {
        return crypto.randomUUID();
    },
    secret: CRYPTO_SESSION_TOKEN
}));

// Allow for passport.js sessions
app.use(passport.initialize());
app.use(passport.session());

// Authenticate everywhere
passport.use(new passportLocal.Strategy(async (email, password, cb) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: email
        }
    });

    const hash = await pbkdf2Async(
        password,
        CRYPTO_SALT_UNSAFE,
        CRYPTO_ITERATIONS,
        CRYPTO_KEY_LENGTH,
        CRYPTO_DIGEST
    );

    const target = await pbkdf2Async(
        CRYPTO_EXAMPLE_PASSWORD,
        CRYPTO_SALT_UNSAFE,
        CRYPTO_ITERATIONS,
        CRYPTO_KEY_LENGTH,
        CRYPTO_DIGEST
    );

    if (!crypto.timingSafeEqual(hash, target)) {
        return cb(null, false);
    }

    return cb(null, user);
}));

app.use(passport.authenticate('session'));

// Use custom authentication
app.use(Auth.authentication);

// Assign the appropriate routers
app.use("/auth", new AuthRouting().toRouter());
app.use("/user", new UserRouting().toRouter());
app.use("/building", new BuildingRouting().toRouter());
app.use("/schedule", new ScheduleRouting().toRouter());

// Finally, an error handler
app.use(ErrorHandler.handle);

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`);
});
