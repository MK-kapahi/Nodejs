const mongoose = require("mongoose");

const mongoDB = new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://127.0.0.1:27017/myDatabase`).then(connected => {
        resolve(connected);
    }).catch(connectionError => {
        reject(connectionError);
    });
});
module.exports = mongoDB;