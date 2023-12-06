const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    roomId : {type :String , required : true}, 
    senderId :{type :String , required : true},
    content: { type: String, required: true },
    start_timestamp: {
        type: Date,
    },
    end_timestamp: {
        type: Date,
        default: null
    },
    update_timestamp:
    {
        type: Date,
        default: null
    }

})
module.exports = mongoose.model("MessageCollection", messageSchema);