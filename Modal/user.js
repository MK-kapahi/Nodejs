const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,  unique : true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  age: { type: Number, required: true },
  imagePath: {
    type: String,
  },
  role : {
    type: Number , required : true
  }
});
module.exports = mongoose.model("User", UserSchema);

