const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    token : {type: String, required: true},
    role :  {type: String, required: true},
  
  })
  module.exports = mongoose.model("Session", SessionSchema);