
const User = require("../Modal/user");
const path = require("path");
const { Roles } = require("../utils/constant");
const multer = require("multer");
const { generateAccessToken } = require("../utils/commonFunction");
const stripe = require('stripe')('sk_test_51OOKRCSHn7J9oTBWYT2TUX4fS2NO60QpAp3ZsJ6Mfm7nXBy99rcdjRpGJHmBBatiXkJw6DpO9UJxSAhSFk25333C008ZVF8TfH');
require('dotenv').config();

//Get all users from the database
const getUsers = async (req, res) => {
  if (req.role == Roles.Admin) {
    try {
      const users = await User.find({ role: 2 });
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  else if (req.role == Roles.User) {
    try {

      console.log(req.userId)
      const users = await User.find({ _id: req.userId });
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  else {
    res.status(401).send("Unauthorized");
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const getAllFilteredUsers = async (req, res) => {

  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);


  try {
    const character = req.query.char;
    const maxAge = req.query.maxAge || 150;
    const minAge = req.query.minAge || 0;

    let query = { role: 2 };

    // Apply all filters using the query
    if (character) {
      query.name = { $regex: new RegExp(character, 'i') }; // Case-insensitive name search
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) {
        query.age.$gte = minAge;
      }
      if (maxAge) {
        query.age.$lt = maxAge;
      }
    }
    // Execute the query and retrieve the results
    const result = await User.find(query).exec();
    // console.log(result)

    const paginatedResults = result.slice(skip, skip + limit);

    res.send({
      result: paginatedResults,
      count: result.length,
    });
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const getSearchedUsers = async (req, res) => {

  const character = req.query.char;
  const curentUserId = req.query.id
  const query = {
    $and: [
      { name: { $regex: new RegExp(character, 'i') } },
      { _id: { $ne: curentUserId } } // Exclude the current user
    ]
  };

  const result = await User.find(query).exec()

  res.status(200).send(result)
}







module.exports = {
  getUsers,
  getImage,
  getUserById,
  getAllFilteredUsers,
  getSearchedUsers,
  storage,
};