
let mongoose = require('mongoose');

let scheduleSchema = mongoose.Schema({
    time: {
        type: String,
        // default: "9:00AM  - 10:00AM"
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    scheduledWith: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    doctor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    }
});

module.exports = mongoose.model('schema', scheduleSchema);