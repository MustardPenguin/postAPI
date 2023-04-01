const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(' ')[1];
  if(token) {
    jwt.verify(token, process.env.jwt_key, (err, decoded) => {
      if(err) {
        return res.status(498).json({
          isLoggedIn: false,
          message: "Failed to Authenticate"
        });
      }
      
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
      next();
    });
  } else {
    // So that guests can fetch posts
    if(req.query.skip) {
      return next();
    }
    return res.status(498).json({ error: "Invalid token" });
  }
}

const verifyJWT1 = (requireLogin) => {
  
  return function(req, res, next) {
    const token = req.headers["x-access-token"]?.split(' ')[1];
    if(token) {
    jwt.verify(token, process.env.jwt_key, (err, decoded) => {
      if(err) {
        return res.status(498).json({
          isLoggedIn: false,
          message: "Failed to Authenticate"
        });
      }
      
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
      next();
    });
  } else {
    // So that guests can fetch posts
    if(!requireLogin) {
      return next();
    }
    return res.status(498).json({ error: "Invalid token" });
  }
  }
}

module.exports =  verifyJWT;