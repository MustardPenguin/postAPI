var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const server = express();

require('dotenv').config();

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

server.use('/users', User);
server.use('/blogs', Blog);
server.use('/comments', Comment);

server.listen(3000, () => {
    console.log("Listening to port 3000");
});