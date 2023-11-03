const express = require('express');
const app = express();
const mongoDB = require("./database/connection");
const cors = require('cors');
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const { testFunc } = require('./Controller/userController');
require('dotenv').config();
const PORT = process.env.PORT

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());

app.use("/v1", userRoutes);

console.log("staging environment connection")

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoDB.then(connected => {
    app.listen(PORT, () => {
        console.log(`App running on port ${PORT} and DataBase is also connected`);
    });
}).catch(connectionError => {
    console.log(`Error connecting to the database App crashed`, connectionError);
});