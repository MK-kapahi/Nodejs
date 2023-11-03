const bcrypt = require("bcrypt");
const User = require("../Modal/user");
const path = require("path");
const { Roles } = require("../utils/constants");

const creatingHashedPass = async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(req.body.password, salt);
  console.log(`Hashed Password : ${hash}`);
  return hash;
};

//Add a new user to database
const addUser = async (req, res) => {
  const hashPass = await creatingHashedPass(req, res);

  const getUsers = await User.find({});
  console.log(Roles.Admin);
  if (getUsers.length >= 1) {
    role = Roles.User;
  } else {
    role = Roles.Admin;
  }

  try {
    console.log("Controller add user" + req.file);
    filename = req.file.filename;
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
      contact: req.body.contact,
      age: req.body.age,
      imagePath: filename,
      role: role,
    });

    // Adjust the path as needed
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//Get all users from the database
const getUsers = async (req, res) => {
  console.log(req.role);
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const users = await User.find({ role: 2 });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//Update User details in Database
const updateUser = async (req, res) => {
  if (req.role != Role.User) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;
  filename = req.file.filename;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      age: req.body.age,
      image: filename,
    });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//Delete user from the database
const deleteUser = async (req, res) => {
  if (req.role != Role.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    res.status(200).send(`User deleted is ${userId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getImage = (req, res) => {
  const name = req.params.name;
  res.sendFile(path.join(__dirname, "../data", name));
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await User.findById(id);
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getImage,
  getUserById,
};
