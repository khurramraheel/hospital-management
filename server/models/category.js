let mongoose = require('mongoose');

let categorySchema =  mongoose.Schema({
    name:String,
    profilePic:String,
    categoryID:String
});

module.exports = mongoose.model("Category", categorySchema);