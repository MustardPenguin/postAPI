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
const RouteAuth = require('./routes/routeAuth');
const User = require('./routes/user');
const Post = require('./routes/post');
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
server.use('/posts', Post);
server.use('/comments', Comment);
server.use('/auth', RouteAuth);
server.use('/public', express.static('public'));

server.listen(port, () => {
    console.log("Listening to port " + port);
});