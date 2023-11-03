const bcrypt = require("bcrypt");
const User = require("../Modal/user");
const path = require("path");

const jwt = require("jsonwebtoken");
const Session = require("../Modal/session");

const creatingHashedPass = async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(req.body.password, salt);
  console.log(`Hashed Password : ${hash}`);
  return hash;
};

//Add a new user to database
const addUser = async (req, res) => {
  const hashPass = await creatingHashedPass(req, res);
  let role = 0;

  const getUsers = await User.find({});

  if (getUsers.length >= 1) {
    role = 2;
  } else {
    role = 0;
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

const loginUser = async (req, res) => {
  const emailId = req.body.email;
  const userPassword = req.body.password;
  console.log(userPassword);
  try {
    const user = await User.findOne({ email: emailId });
    console.log(user);
    if (user) {
      console.log("heyyy");
      await bcrypt
        .compare(userPassword, user.password)
        .then(async (response) => {
          const token = jwt.sign({ user_id: user._id }, process.env.JWT_KEY, {
            expiresIn: "2h",
          });

          const session = new Session({
            userId: user._id,
            token: token,
            role: user.role,
          });

          await session.save();
          console.log(response);
          console.log(token);
          res.send(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Password not matched");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// validating the role of user
const validateToken = (req, response) => {
  const token = req.headers["auth"];
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      console.log(decoded);
      if (decode.role === 0) {
        response.status(200).send("Sucess");
      } else {
        response.status(401).send("Un authorized");
      }
    }
  });
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getImage,
  getUserById,
  loginUser,
  validateToken,
};
