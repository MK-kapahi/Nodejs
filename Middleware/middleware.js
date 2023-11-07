const jwt = require("jsonwebtoken");
const Session = require("../Modal/session");
const Role = require("../utils/constant")

const validateToken = async (req, response, next) => {
  console.log("middleware called");
  console.log(req.headers);
  const token = req.headers["authorization"];
  console.log(token);

  //check the user has a session in session table of not

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      response.send(err);
    } else {
      console.log("Hi i am decoded token" + decoded);
      console.log(Object.keys(decoded));
      console.log(Object.values(decoded));
      const session = await Session.find({ userId: decoded.user_id });
      console.log("Hi i am session" + session);
      if (session[0].token === token) {
        req.role = session[0].role;
        req.userId = session[0].userId;

        if (session[0].role == 1) {
          req.userId = session[0].userId;
          next();
        } else {
          response.status(401).send("Unauthorized");
        }
      } else {
      }
    }
  });
};

const AuthenticationMiddleware = (req, res, next) => {
  console.log(req.headers);
  const token = req.headers["authorization"];

  console.log(token);
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      const session = await Session.find({ userId: decoded.user_id });
      if (session[0].token === token) {
        req.role = session[0].role;
        req.userId = session[0].userId;
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  });
};

module.exports = {
  validateToken,
  AuthenticationMiddleware,
};