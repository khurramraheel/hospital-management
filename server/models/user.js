let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: String,
    about:String,
    email: String,
    address: String,
    qualification:String,
    contact: String,
    type: String,
    profilePic: String,
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category"
    },
    password: String,
    status: {
        type: String,
        default: "active"
    }
})

module.exports = mongoose.model('user', userSchema);