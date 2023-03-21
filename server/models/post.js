const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const postSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: User, required: true },
    date: { type: Date, required: true },
    image: { type: String,  }
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('Post', postSchema);