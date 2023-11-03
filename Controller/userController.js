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
  console.log(req.body)
  const emailId = req.body.email;
  const userPassword = req.body.password;
  console.log(userPassword)
  try {
    const user = await User.findOne({ email: emailId });
    if (user) {
      await bcrypt
        .compare(userPassword, user.password)
        .then(async (response) => {
          const token = jwt.sign({ user_id: user._id }, process.env.JWT_KEY, {
            expiresIn: "10m",
          });

          let sessionInquiry = await getSessionUser(user._id)
          console.log(sessionInquiry)
          if (sessionInquiry) {
            console.log("heyyyy")
            try {
              const session = await Session.findByIdAndUpdate(user._id, {
                token: token
              });
              console.log("token updated");
              // await session.save();
            } catch (error) {
              console.log(error);
              // res.status(500).send(error);
            }

            res.status(200).send({
              data: user,
              token: token,
              message: " Login in Sucessful"
            })
          }

          else {

            console.log("session created")
            const session = new Session({
              userId: user._id,
              token: token,
              role: 0,
            });
            await session.save();
            res.status(200).send({
              data: user,
              token: token,
              message: " Login in Sucessful"
            })
          }

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

const logoutUser = async (req, response) => {
  const id = req.userId

  try {
    const session = await Session.findByIdAndDelete(id)
    console.log(session);
    response.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }

}

const getSessionUser = async (id) => {

  const user = await Session.find({ userId: id })
  console.log(user.length)
  if (user.length != 0) {
    return true;
  }

  else {
    return false
  }

}

const updateSession = async (userId, newtoken) => {
  try {
    const session = await Session.findByIdAndUpdate(userId, {
      token: newtoken
    });
    console.log("token updated");
    await session.save();
  } catch (error) {
    console.log(error);
    // res.status(500).send(error);
  }
};


module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getImage,
  getUserById,
  loginUser,
  logoutUser
};