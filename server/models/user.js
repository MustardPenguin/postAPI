const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const blogAPI = mongoose.connection.useDb('blogAPI');

module.exports = blogAPI.model('User', UserSchema);