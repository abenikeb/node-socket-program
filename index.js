const express = require("express");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

const createOrder = require("./service/createOrderService");

wss.on("connection", (ws) => {
  console.log("establish websocket connection");
  ws.on("message", (message) => {
    console.log("received: %s", message);
  });
});

app.post("/create/order", (req, res) => {
  wss.clients.forEach(async (client) => {
    if (client.readyState === WebSocket.OPEN) {
      const resultRaq = await createOrder.createOrder(req, res);
      client.send(resultRaq);
    }
  });
  res.json({ TITLE: req.body.amount }).status(200);
});

server.listen(port, () =>
  console.log(`http server is listening on http://localhost:${port}`)
);
