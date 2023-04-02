import express from "express";
import { UserRouting } from "./routes/user";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { BuildingRouting } from "./routes/building";
import "express-async-errors";
import { ErrorHandler } from "./errors/error_handler";
import { ScheduleRouting } from "./routes/schedule";
import { AuthRouting } from "./routes/auth";
import { ActionRouting } from "./routes/action";
import { SyndicusRouting } from "./routes/syndicus";
import { RoundRouting } from "./routes/round";
import passport from "passport";
import crypto from "crypto";
import session from "express-session";
import { initializePassport } from "./passport";
import dotenv from "dotenv";
import { GarbageRouting } from "./routes/garbage";

import { FileRouter } from "./routes/file";

import { ProgressRouting } from "./routes/progress";


const PORT_NUMBER = 8080;
const CRYPTO_SESSION_TOKEN = "verysecrettoken";

const app = express();

// Parse environment file.
dotenv.config();

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
app.use(
    session({
        genid: function (req) {
            return crypto.randomUUID();
        },
        secret: CRYPTO_SESSION_TOKEN,
    }),
);

// Allow for passport.js sessions
initializePassport();
app.use(passport.session());

// Assign the appropriate routers
app.use("/auth", new AuthRouting().toRouter());
app.use("/user", new UserRouting().toRouter());
app.use("/building", new BuildingRouting().toRouter());
app.use("/schedule", new ScheduleRouting().toRouter());
app.use("/garbage", new GarbageRouting().toRouter());
app.use("/action", new ActionRouting().toRouter());
app.use("/syndicus", new SyndicusRouting().toRouter());
app.use("/round", new RoundRouting().toRouter());

app.use("/file", FileRouter);

app.use("/progress", new ProgressRouting().toRouter());


// Finally, an error handler
app.use(ErrorHandler.handle);

// If the authorization process is bypassed, print a big red warning
if (process.env.DISABLE_AUTH === "true") {
    console.log("\x1b[41mDANGER: AUTHORIZATION BYPASSED\x1b[0m");
}

// Actually start the server, we're done!
const server = app.listen(PORT_NUMBER, () => {
    console.log(`API AVAILABLE AT: https://localhost:${PORT_NUMBER}`);
});

// export the server for testing
export default server;
