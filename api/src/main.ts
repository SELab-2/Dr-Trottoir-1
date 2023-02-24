import express from "express";

const PORT_NUMBER = 8080;

const app = express();

app.get('/', function (req, res) {
  res.send('Hello, World!')
});

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port: ${PORT_NUMBER}.`)
});
