const bcrypt = require("bcrypt");
const User = require("../Modal/user");
const multer = require("multer");
const path = require("path");
const user = require("../Modal/user");

let imagePathUploaded;

creatingHashedPass = async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(req.body.password, salt);
  console.log(`Hashed Password : ${hash}`);
  return hash;
};

//Add a new user to database
const addUser = async (req, res) => {
  const hashPass = await creatingHashedPass(req, res);
  console.log(req.body);


  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
      contact: req.body.contact,
      age: req.body.age,
    });

    console.log("Controller add user"+req.file)
      filename =req.file.filename;
     // Adjust the path as needed
    user.imagePath = filename
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//Get all users from the database
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//Update User details in Database
const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      age: req.body.age,
    });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//Delete user from the database
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user)
    res.status(200).send(`User deleted is ${userId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


const getImage = (req, res) =>{
  const name = req.params.name;
  res.sendFile(path.join(__dirname, '../data', name));
}


module.exports = { getUsers, addUser, updateUser, deleteUser ,getImage };