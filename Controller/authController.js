const { Roles } = require("../utils/constant");
const Session = require("../Modal/session");
const User = require("../Modal/user");
const { creatingHashedPass } = require("../utils/commonFunction")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users =[ ];


const loginUser = async (req, res) => {
  console.log(req)
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

    const token = jwt.sign({ user_id: user._id , role : user.role }, process.env.JWT_KEY , {
      expiresIn: "2h",
    });

    console.log(token)

    // let sessionInquiry = await getSessionUser(user._id);
    // if (sessionInquiry) {
    //   //update the session
    //   console.log("Updating the session");
    //   try {
    //     console.log("Session updating");
    //     const session = await Session.findOneAndUpdate(
    //       { userId: user._id },
    //       {
    //         token: token,
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //     return res.status(500).send(error);
    //   }
    // } else {
    //   //create the session
    //   // console.log("Creating new session");
    //   // const session = new Session({
    //   //   userId: user._id,
    //   //   token: token,
    //   //   role: user.role,
    //   // });
    //   // await session.save();
    // }

    res.cookie( "token" , token, {
      maxAge: 2 * 60 * 60 * 1000,
      domain: "localhost",
    });
    // res.setHeader("token", token, {
    //   maxAge: 2 * 60 * 60 * 1000,
    // });
    res.status(200).send({
      data: user,
      message: " Login in Sucessful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// const getSessionUser = async (id) => {
//   const user = await Session.find({ userId: id });
//   console.log(user.length);
//   if (user.length != 0) {
//     return true;
//   } else {
//     return false;
//   }
// };

const logoutUser = async (req, response) => {
  const id = req.userId;

  try {
     res.clearCookie()
    response.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
};


const register = async (req, res) => {
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }

  const hashPass = await creatingHashedPass(req, res);


    const getUsers = await User.find({});
    console.log(Roles.Admin);
    if (getUsers.length >= 1) {
      role = Roles.User;
    } else {
      role = Roles.Admin;
    }

    let user = await User.find({email : req.body.email})

    if(user.length != 0 )
    {
      res.status(400).send("Email Already exsist ")
    }

    else
    {
      
      try {
        console.log("Controller add user" + req.file);
        filename = req.file.filename;
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password : hashPass,
          contact: req.body.contact,
          age: req.body.age,
          imagePath: filename,
          role: role,
        });
    
    
        await user.save();
        res.send( user);
      } catch (error) {
        console.log(error);
           res.send(error);
      }
    }
    
  };

const getData = async (req , res) =>{
  try {
    const users = await User.find({ });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}  

module.exports = { loginUser, logoutUser , register , getData };