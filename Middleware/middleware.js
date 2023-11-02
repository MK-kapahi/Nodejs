// validating the role of user
const jwt = require("jsonwebtoken");
const Session = require("../Modal/session");

const validateToken = async (req, response, next) => {
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
        if (session[0].role === 0) {
          response.status(200).send("Success");
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

module.exports = {
  validateToken,
};
