const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blog = require('./blog');
const User = require('./user');

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    blog: { type: Schema.Types.ObjectId, ref: Blog, required: true },
    date: { type: Date, required: true },
    comment: { type: String, required: true, trim: true },
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('Comment', commentSchema);