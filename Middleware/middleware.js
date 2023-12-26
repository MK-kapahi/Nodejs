const jwt = require("jsonwebtoken");

const AuthenticationMiddleware = (req, res, next) => {
  const cookie = req.headers.cookie;
  const cookies = req.headers.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.includes('token='));

  if (tokenCookie) {
    // const token = cookie.value()
    const token  = tokenCookie.split('token=')[1];
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

  else {
    res.send("Invalid Session")
  }
};

module.exports = {
  AuthenticationMiddleware,
};