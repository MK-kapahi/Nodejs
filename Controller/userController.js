
const User = require("../Modal/user");
const path = require("path");
const { Roles } = require("../utils/constant");
const multer = require("multer");

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
  console.log("heyyyyyyyyyyyyy")
  const char = "";
  console.log(char)

  const search = await User.find({});
  const filter = []

  try {

    if (char.trim() === '') {
      console.log(search)
    }

    else {
      for (const singleUser of search) {
        const nameLowerCase = singleUser.name.toLowerCase();

        // || (singleUser.age >= req.param.minAge && singleUser.age < req.param.maxAge)
        if (nameLowerCase.includes(char)) {
          filter.push(singleUser)
        }
      }
      res.send(filter)

    }
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = {
  getUsers,
  getImage,
  getUserById,
  getAllFilteredUsers,
  storage,
};