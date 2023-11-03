const express = require("express");
const app = express();
const http = require("http");
const mongoDB = require("./database/connection");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const PORT = 8000;
var path = require("path");

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.use("/user", userRoutes);

let server;

console.log("staging environment connection");
server = http.createServer(app);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// var dir = path.join(__dirname ,'/data')
// app.use(express.static(dir))

mongoDB
  .then((connected) => {
    server.listen(PORT, () => {
      console.log(`App running on port ${PORT} and DataBase is also connected`);
    });
  })
  .catch((connectionError) => {
    console.log(
      `Error connecting to the database App crashed`,
      connectionError
    );
  });
