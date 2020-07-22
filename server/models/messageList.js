let mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
    author: String,
    receiver: String,
    data: {
        text: '',
    },
    type: {
        type: String
    },
    date: String,
    readByAdmin: Boolean,
    readBy: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user"
        }
    ]
});

module.exports = mongoose.model('message', messageSchema);