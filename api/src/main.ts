import express from "express";
import { UserRouting } from "./routes/user";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { prisma } from "./prisma";
import { BuildingRouting } from "./routes/building";
import "express-async-errors";
import { ErrorHandler } from "./errors/error_handler";

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

// Authentication. For now, we just remember the user at the other end
app.use(async (req, res, next) => {
    let id: number | null = null;
    const value = req.header("Authentication");

    // Parse the header and try to retrieve the identifier of the user.
    // TODO: actually use some form of authentication :)
    try {
        id = parseInt(value ?? "");
    } catch (e) {
        // Do nothing yet
    }

    // If there is an identifier, attempt to retrieve the corresponding user
    req.user = null;
    if (id !== null) {
        try {
            req.user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (e) {
            // Do nothing yet
        }
    }

    // We're done!
    next();
});

// Placeholder responsive for the root of the server
app.get("/", function (req, res) {
    throw Error("Oops");
});

// Assign the appropriate routers
app.use("/user", new UserRouting().toRouter());
app.use("/building", new BuildingRouting().toRouter());
app.use(ErrorHandler.handle);

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`);
});
