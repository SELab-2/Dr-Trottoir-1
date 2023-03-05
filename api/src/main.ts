import express from "express";
import { UserRouting } from "./routes/user";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { BuildingRouting } from "./routes/building";
import "express-async-errors";
import { ErrorHandler } from "./errors/error_handler";
import { Auth } from "./auth/auth";

const PORT_NUMBER = 8080;

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

// Use custom authentication
app.use(Auth.authentication);

// Assign the appropriate routers
app.use("/user", new UserRouting().toRouter());
app.use("/building", new BuildingRouting().toRouter());

// Finally, an error handler
app.use(ErrorHandler.handle);

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`);
});
