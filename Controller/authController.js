const Session = require("../Modal/session");
const User = require("../Modal/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  console.log(req.body);
  const emailId = req.body.email;
  const userPassword = req.body.password;
  console.log(userPassword);
  try {
    const user = await User.findOne({ email: emailId });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_KEY, {
      expiresIn: "2h",
    });

    let sessionInquiry = await getSessionUser(user._id);
    if (sessionInquiry) {
      //update the session
      console.log("Updating the session");
      try {
        console.log("Session updating");
        const session = await Session.findOneAndUpdate(
          { userId: user._id },
          {
            token: token,
          }
        );
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    } else {
      //create the session
      console.log("Creating new session");
      const session = new Session({
        userId: user._id,
        token: token,
        role: user.role,
      });
      await session.save();
    }
    res.status(200).send({
      data: user,
      token: token,
      message: " Login in Sucessful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getSessionUser = async (id) => {
  const user = await Session.find({ userId: id });
  console.log(user.length);
  if (user.length != 0) {
    return true;
  } else {
    return false;
  }
};

const logoutUser = async (req, response) => {
  const id = req.userId;

  try {
    const session = await Session.findByIdAndDelete(id);
    console.log(session);
    response.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
};

module.exports = { loginUser, logoutUser };
