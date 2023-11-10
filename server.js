const express = require("express");
const app = express();
const mongoDB = require("./database/connection");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require("dotenv").config();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["abc"],
  })
);

app.use("/api/v1", userRoutes);

console.log("staging environment connection");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoDB
  .then((connected) => {
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT} and DataBase is also connected`);
    });
  })
  .catch((connectionError) => {
    console.log(
      `Error connecting to the database App crashed`,
      connectionError
    );
  });
