const express = require('express');
const app = express();
const mongoDB = require("./database/connection");
const cors = require('cors');
const http = require('http');
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const cookieParser = require('cookie-parser');
const initializeSocket = require('./socket');
const server = http.createServer(app);


// Initialize socket.io by passing the HTTP server instance

const {
  Port,
  URL
} = require("./config");
const { captureOrder } = require('./Controller/userController');
const PORT = Port || 8000

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const io = initializeSocket(server);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1", userRoutes);

console.log("staging environment connection")

app.use(express.json());

const listenWebHook = async (req, res) => {
  try {
    console.log("Webhook received:", req.body.resource);

    if (req.body.resource.status === 'APPROVED') {
      // Assuming captureOrder returns a promise
      return res.send(req.body.resource.id)
    } else {
      console.log("Order status is not APPROVED. Ignoring.");
      res.status(200).send("Webhook received, but order status is not APPROVED.");
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }

}

app.use(express.urlencoded({ extended: true }));
app.post("/listenWebHook", listenWebHook)

mongoDB.then(connected => {
  server.listen(PORT, () => {
    console.log(`App running on port ${PORT} and DataBase is also connected`);
  });


}).catch(connectionError => {
  console.log(`Error connecting to the database App crashed`, connectionError);
});
