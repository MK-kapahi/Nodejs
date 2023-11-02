const express = require("express");
const app = express();
require("dotenv").config();
const mongoDB = require("./database/connection");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());

app.use("/user", userRoutes);

console.log("staging environment connection");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// var dir = path.join(__dirname ,'/data')
// app.use(express.static(dir))
const PORT = parseInt(process.env.PORT);
mongoDB
  .then(() => {
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
