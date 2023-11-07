const mongoose = require("mongoose");

const mongoDB = new Promise((resolve, reject) => {
  mongoose
    .connect(
      "mongodb+srv://namanagg59:0GRLxscoido1wWPu@cluster0.5dvi5xl.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((connected) => {
      resolve(connected);
    })
    .catch((connectionError) => {
      reject(connectionError);
    });
});
module.exports = mongoDB;
