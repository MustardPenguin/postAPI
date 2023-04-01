const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./post');
const User = require('./user');

const commentSchema = new Schema({
    username: { type: Schema.Types.ObjectId, ref: User, required: true },
    post: { type: Schema.Types.ObjectId, ref: Post, required: true },
    date: { type: Date, required: true },
    comment: { type: String, required: true },
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('Comment', commentSchema);