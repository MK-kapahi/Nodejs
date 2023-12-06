const mongoose = require("mongoose");
const chatUserModel = new mongoose.Schema({
  members : { type : Array , required : true },
  roomName : {type : String , required : true ,unique : true },
  start_timestamp: {
    type: Date,
  },
  end_timestamp: {
    type: Date,
    default: null
  },

})
module.exports = mongoose.model("ChatRoom ", chatUserModel);