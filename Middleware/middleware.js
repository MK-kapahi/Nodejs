const jwt = require("jsonwebtoken");

const AuthenticationMiddleware = (req, res, next) => {
  const cookie = req.headers.cookie;

  if (cookie) {
    // const token = cookie.value()
    const token = cookie.substring(cookie.indexOf('=') + 1)
    // const token = req.headers.cookie;
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        res.send(err)
      } else {
        req.role = decoded.role;
        req.userId = decoded.user_id;
        next();
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