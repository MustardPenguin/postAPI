var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const server = express();
const session = require('express-session');
const passportAuth = require('./auth');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const port = 5000;

// Routes
const User = require('./routes/user');
const Blog = require('./routes/blog');
const Comment = require('./routes/comment');

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.mongo_url;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

server.use(cors());
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use(session({
  secret: 'corgis', resave: false, saveUninitialized: true
}));
server.use(passportAuth.initialize());
server.use(passportAuth.session());

server.use('/users', User);
server.use('/blogs', Blog);
server.use('/comments', Comment);

// dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57
server.post('/sign-in',
  passportAuth.authenticate("local", {
    session: false
  }), (req, res, next) => {
    const payload = {
      id: req.user._id,
      username: req.user.username,
    }
    console.log(payload);
    jwt.sign(
      payload,
      "secret", // replace later
      { expiresIn: 86400 },
      (err, token) => {
        if(err) {
          return res.json({ message: err });
        }
        return res.json({
          message: "Success",
          token: "Bearer " + token
        });
      }
    );
  },
);


server.get("/log-out", (req, res, next) => {
  req.logout(function(err) {
    if(err) {
      return next(err);
    }
    console.log("Logged out");
  });
});

server.use(function(req, res, next) {
  
  next();
});

server.listen(port, () => {
    console.log("Listening to port " + port);
});