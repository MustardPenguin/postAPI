const express = require('express');
const router = express.Router();
const passportAuth = require('../auth');
const jwt = require("jsonwebtoken");
const jwtVerify = require('../jwtverify');
require('dotenv').config();

// dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57
router.post('/sign-in',
  passportAuth.authenticate("local", {
    session: false
  }), (req, res, next) => {
    const payload = {
      id: req.user._id,
      username: req.user.username,
    }
    
    jwt.sign(
      payload,
      process.env.jwt_key,
      { expiresIn: 86400 },
      (err, token) => {
        if(err) {
          return res.json({ message: err });
        }
        return res.json({
          message: "Success",
          token: "Bearer " + token,
          username: req.user.username
        });
      }
    );
  },
);

router.get("/log-out", jwtVerify, (req, res, next) => {
    console.log(req.user);
    req.logout(function(err) {
      if(err) {
        return next(err);
      }
      console.log("Logged out");
    });
});

router.get('/verify', jwtVerify, (req, res, next) => {
  if(req.user) {
    res.json({ user: req.user });
  } else {
      res.json({ user: null });
  }
});

module.exports = router;