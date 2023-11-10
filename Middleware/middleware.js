const jwt = require("jsonwebtoken");

const AuthenticationMiddleware = (req, res, next) => {
  console.log("token " + req.headers.cookie);
  const cookie = req.headers.cookie;


  if (cookie) {
    // const token = cookie.value()
    const token = cookie.substring(cookie.indexOf('=') + 1)
    // const token = req.headers.cookie;
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        console.log(err);
        res.send(err)
      } else {
        console.log(decoded)
        // const session = await Session.find({ userId: decoded.user_id });
        // if (session[0].token === token) {
        req.role = decoded.role;
        req.userId = decoded.user_id;
        next();
        // } else {
        //   res.status(401).send("Unauthorized");
        // }
      }
    });
  }

  else 
  {
    res.send("Invalid Session")
  }
};

module.exports = {
  AuthenticationMiddleware,
};