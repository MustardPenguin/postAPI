const jwt = require('jsonwebtoken');

const verifyJWT = (requireLogin) => {
  //console.log(requireLogin);
  return function(req, res, next) {
    const token = req.headers["x-access-token"]?.split(' ')[1];
    if(token) {
      jwt.verify(token, process.env.jwt_key, (err, decoded) => {
        if(err) {
          console.log(err);
          return res.status(498).json({
            isLoggedIn: false,
            message: err.toString(),
            expired: true
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
    return res.status(498).json({ error: err.toString() });
  }
  }
}

module.exports =  verifyJWT;