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
  } else if (req.role == Roles.User) {
    try {
      console.log(req.userId);
      const users = await User.find({ _id: req.userId });
      res.status(200).send(users);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  } else {
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

  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 2;

  const search = await User.find({role : 2});

  try {
    const character = req.query.char;
    const maxAge = req.query.maxAge || 0;
    const minAge = req.query.minAge || 0;


    if ((typeof character === "undefined" || character === "") && (maxAge === 0) && (maxAge === 0)) 
    {
      const paginatedResults = search.slice(skip, skip + limit);
      res.send(paginatedResults);
    }

    else if(character != "" && (maxAge === 0) && (maxAge === 0))
    {
      let filteredArray = search.filter((singleUser) => {
        const nameLowerCase = singleUser.name
        if (nameLowerCase.includes(character)) {
          return singleUser
        }
      })
      const paginatedResults = filteredArray.slice(skip, skip + limit);
      res.send(paginatedResults);
    }


    else if((typeof character === "undefined" || character === "") && (maxAge != 0) && (maxAge != 0)) {

      console.log("inside 2nd if")

      let filteredUserAccToAge = search.filter((singleUser) =>{

        if(singleUser.age >= minAge && singleUser.age < maxAge)
        {
          return singleUser;
        }
      }
      )
      const paginatedResults = filteredUserAccToAge.slice(skip, skip + limit);
      res.send(paginatedResults);

    }
    else {

      console.log("inside 2nd else")


      let filteredArray = search.filter((singleUser) => {
        const nameLowerCase = singleUser.name
        if (nameLowerCase.includes(character) && singleUser.age >= minAge && singleUser.age < maxAge) {
          return singleUser
        }
      })
      const paginatedResults = filteredArray.slice(skip, skip + limit);
      res.send(paginatedResults);
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getUsers,
  getImage,
  getUserById,
  getAllFilteredUsers,
  storage,
};
