const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const blogSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: User, required: true },
    date: { type: Date, required: true }
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('Blog', blogSchema);