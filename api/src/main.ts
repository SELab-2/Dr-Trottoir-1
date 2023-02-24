import express from "express";
import {UserRouting} from "./routes/user";

const PORT_NUMBER = 8080;

const app = express();

app.get('/', function (req, res) {
  res.send('Hello, World!')
});

app.use('/user', new UserRouting().toRouter());

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`)
});
