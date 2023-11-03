const jwt = require("jsonwebtoken");
const Session = require("../Modal/session");
const { response } = require("express");

const validateToken = async (req, response, next) => {
  console.log("middleware called");
  console.log(req.headers);
  const token = req.headers["authorization"];
  console.log(token);

  //check the user has a session in session table of not

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      response.send(err)
    } else {
      console.log("Hi i am decoded token"+decoded);
      console.log(Object.keys(decoded))
      console.log(Object.values(decoded))
      const session = await Session.find({ userId: decoded.user_id });
      console.log("Hi i am session" + session);
      if (session[0].token === token) {
        if (session[0].role == 0) {
          req.userId = session[0].userId;
          next();
        } else {
          response.status(401).send("Unauthorized");
        }
      } else {
        console.log("askdjbasjbdjas");
      }
    }
  });
};


const validateUser = async (req , response , next  ) => {
  console.log("middleware called");
  console.log(req.headers);
  const token = req.headers["authorization"];
  console.log(token);

  //check the user has a session in session table of not

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      console.log(decoded);
      const session = await Session.find({ userId: decoded.user_id });
      console.log(session);
      if (session[0].token === token) {
      
          next(session[0].userId);
      } else {
        response.status(401).send("Unauthorized");
      }
    }
  });
}

module.exports = {
  validateToken,
  validateUser,
};