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
const stripe = require('stripe')('sk_test_51OOKRCSHn7J9oTBWYT2TUX4fS2NO60QpAp3ZsJ6Mfm7nXBy99rcdjRpGJHmBBatiXkJw6DpO9UJxSAhSFk25333C008ZVF8TfH');


// Initialize socket.io by passing the HTTP server instance

const {
  Port,
  URL
} = require("./config");
const { captureOrder } = require('./Controller/paymentController');
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

    if (req.body.resource.status == 'APPROVED') {
      const paymentRes = await captureOrder(req.body.resource.id)

      if (paymentRes) {
        io.emit('paymentResponse', paymentRes)
      }
      else {
        console.log("connection error")
      }
    } else {
      console.log("Order status is not APPROVED. Ignoring.");
      res.status(200).send("Webhook received, but order status is not APPROVED.");
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }

}

// const listenStripeHook = (req, res) =>{
//   console.log("Webhook received",req.body)
// }

app.use(express.urlencoded({ extended: true }));
app.post("/listenWebHook", listenWebHook)
// app.post("/listenStripeHook" ,listenStripeHook )

mongoDB.then(connected => {
  server.listen(PORT, () => {
    console.log(`App running on port ${PORT} and DataBase is also connected`);
  });


}).catch(connectionError => {
  console.log(`Error connecting to the database App crashed`, connectionError);
});
