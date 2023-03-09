var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const server = express();

require('dotenv').config();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
//mongoose.set('strictPopulate', false);
const mongoDB = process.env.mongo_url;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => res.send("Hello world!"));

server.listen(3000, () => {
    console.log("Listening to port 3000");
});