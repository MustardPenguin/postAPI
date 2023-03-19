const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

const likeSchema = new Schema({
    username: { type: Schema.Types.ObjectId, ref: User, required: true },
    likedPost: { type: Schema.Types.ObjectId, ref: Post },
    likedComment: { type: Schema.Types.ObjectId, ref: Comment }
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('Likes', likeSchema);