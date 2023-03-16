const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(' ')[1];
  if(token) {
    jwt.verify(token, process.env.jwt_key, (err, decoded) => {
      if(err) {
        return res.json({
          isLoggedIn: false,
          message: "Failed to Authenticate"
        });
      }
      console.log(decoded);
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
      next();
    });
  } else {
    res.json({ message: "Invalid token" });
  }
}

module.exports =  verifyJWT;