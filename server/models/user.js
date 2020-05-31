let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: String,
    email: String,
    address: String,
    contact: String,
    type: String,
    profilePic:String,
    password:String
})

module.exports = mongoose.model('user', userSchema);