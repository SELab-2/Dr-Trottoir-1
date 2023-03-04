import express from "express";
import {UserRouting} from "./routes/user";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import {prisma} from "./prisma";

const PORT_NUMBER = 8080;

const app = express();

// Helmet adds many headers for more secure connections
app.use(helmet());

// Morgan logs and prints all incoming requests
app.use(morgan('dev'));

// Compress responses
app.use(compression());

// Authentication. For now, we just remember the user at the other end
app.use(async (res, req, next) => {
    res.user = await prisma.user.findFirst({
        where: {
            id: 0,
        }
    })
    next();
})

// Placeholder responsive for the root of the server
app.get('/', function (req, res) {
  res.send('Hello, world!')
});

// Assign the appropriate subrouters
app.use('/user', new UserRouting().toRouter());

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`)
});
